import { makeAutoObservable, observable } from "mobx";
import { toast } from "react-toastify";
import axios from '../utils/axios';
import { IServiceProvider, IUser } from '../interfaces/User';
import fakeRequest from "../utils/fakeRequest";
import appGlobalConst from '../config';
import Web3 from 'web3';

declare var window: any;

export class UserStore {
  users: IUser[];

  constructor() {
    makeAutoObservable(this)

    this.users = [];
  }

  getUsers = async () => {
    this.users = new Array<IUser>();

    const ContractABI  = require("../contracts/DocumentScore.json");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);

    const Contract = new window.web3.eth.Contract(ContractABI, appGlobalConst.ContractAddress);

    const userList = await Contract.methods.getUserDocuments().call();

    userList.forEach((userItem:any) => {
      let totalScore:number = 0;
      let documents:Array<string> = new Array<string>();

      userItem.documents.forEach((documentItem:any) => {
        totalScore += parseInt(documentItem.score);
        documents.push(documentItem.id);
      });

      const user:IUser = {
        id : 0,
        username: userItem.userName,
        total_score: totalScore,
        num_document: userItem.documents.length,
        documents: documents
      };

      this.users.push(user);
    });
  }

  addUser = async (user: IServiceProvider) => {
    const ContractABI  = require("../contracts/DocumentScore.json");

    const web3 = new Web3(new Web3.providers.HttpProvider(appGlobalConst.RPCUrl));
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);

    const contract = new window.web3.eth.Contract(ContractABI, appGlobalConst.ContractAddress);
    return contract.methods.addDocuments(user.username, user.files).send({from: accounts[0]})
    .on('receipt', function (receipt: any) {
      console.log(receipt);
      toast.success("New document added", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    })
    .on('error', function (error: any, receipt: any) {
      console.log(error);
      toast.error("Error adding user document", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    });
    return;
  };

  updateUser = async (user: IUser) => {
    const exists = this.users.filter(item => item.id === user.id);
    if (exists.length > 1 || exists.length === 0) {
      toast.error("User error", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }

    await axios.post('/api/updateUser', user);

    const updatedUsers = this.users.map(item => {
      if (item.id === user.id) {
        return { ...user };
      }
      return item;
    });
    this.users = updatedUsers;
    toast.success("User updated", {
      position: toast.POSITION.BOTTOM_CENTER
    });
  };

  getUser = (id: number) => {
    const user = this.users.filter(item => item.id === id);
    return user;
    // console.log("id", typeof(id));
    // console.log("users", this.users);
    // const exists = this.users.filter(item => item.id === id);
    // console.log(exists.length);
  }

  deleteUser = async (id: number) => {
    const updatedUsers = this.users.filter(user => user.id !== id);

    await fakeRequest(1000);

    this.users = updatedUsers;
    toast.info("User deleted", {
      position: toast.POSITION.BOTTOM_CENTER
    });

    return;
  };
}