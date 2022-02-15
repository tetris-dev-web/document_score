import * as React from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps
} from "@progress/kendo-react-form";
import { StackLayout } from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import { Error } from "@progress/kendo-react-labels";
import { getter } from "@progress/kendo-react-common";
import { Button } from '@progress/kendo-react-buttons';
import { Upload, UploadOnBeforeUploadEvent, UploadOnStatusChangeEvent } from "@progress/kendo-react-upload";
import LoadingScreen from "./LoadingScreen";
import appGlobalConst from '../config';
import { IServiceProvider } from "../interfaces/User";
import { useStores } from "../use-stores";

declare var window: any;
const usernameGetter: any = getter("username");

const ValidatedInput = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const ServiceProvider = () => {
  const { userStore } = useStores();
  let history = useHistory();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [file_1, setFile1] = React.useState<string>("");
  const [file_2, setFile2] = React.useState<string>("");
  const [file_3, setFile3] = React.useState<string>("");

  const submitValidator = (values: any) => {

    let validated: boolean = true;
    
    // User name validation
    let msgUsername: string = "";
    const username = usernameGetter(values);
    if (validated && (username == undefined || username == "")) {
      msgUsername = "Usernameis required";
      validated = false;
    }
    if (validated && username != undefined && username.length > 25) {
      msgUsername = "User length should be less than 15.";
      validated = false;
    }
  
    if (validated) {
      const alphanumericRegex: RegExp = new RegExp(/^[0-9a-zA-Z]+$/);
      if (!alphanumericRegex.test(username)) {
        msgUsername = "Username should be alphanumeric.";
        validated = false;
      }
    }
  
    // If validation is ok, pass it
    if (validated) return;
  
    return {
      VALIDATION_SUMMARY: "Please input username and upload any document",
      ["username"]: msgUsername,
    };
  };

  const onBeforeUpload = (event: UploadOnBeforeUploadEvent) => {
    setIsUploading(true);
  };

  const onFileUpload1 = (event: UploadOnStatusChangeEvent) => {
    if (event.response) {
      setIsUploading(false);
      setFile1(event.response?.response.Hash);
    }
  };

  const onFileUpload2 = (event: UploadOnStatusChangeEvent) => {
    if (event.response) {
      setIsUploading(false);
      setFile2(event.response?.response.Hash);
    }
  };

  const onFileUpload3 = (event: UploadOnStatusChangeEvent) => {
    if (event.response) {
      setIsUploading(false);
      setFile3(event.response?.response.Hash);
    }
  };

  const onSubmit = (event: any) => {
    setIsLoading(true);

    // Calculate total score
    let files:Array<Array<string|number>> = new Array();

    if (file_1 != "") files.push([file_1, 10]);
    if (file_2 != "") files.push([file_2, 50]);
    if (file_3 != "") files.push([file_3, 30]);
    
    // Save data
    const submitData:IServiceProvider = {
      id: Date.now(),
      username : event.username,
      files : files
    }

    // console.log(submitData);
    setIsLoading(true);
    userStore.addUser(submitData).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <div>
      <div className="page-wrapper page-service_provider">
        <StackLayout orientation="vertical" align={{ vertical: "top" }}>
          <div className="box header"></div>
          <StackLayout orientation="horizontal">
            <div className="box nav"></div>
            <div className="box content">
              <Form
                initialValues={{
                  username: "",
                  file_1: "",
                  file_2: "",
                  enabled: true
                }}
                onSubmit={onSubmit}
                validator={submitValidator}
                render={(formRenderProps) => (
                  <FormElement style={{ maxWidth: 650, marginLeft: "auto", marginRight: "auto" }}>
                    <fieldset className={"k-form-fieldset"}>
                      <legend className={"k-form-legend"}>
                        Please add username and upload any document:
                      </legend>
                      <div className="row">
                        <div className="mb-6">
                          <Field
                            name={"username"}
                            component={ValidatedInput}
                            label={"User Name"}
                          />
                        </div>
                        <div className="mb-6">
                          <br />
                          <Field
                            name={"file_1"}
                            component={Upload}
                            label={"First Document"}
                            autoUpload ={false}
                            batch={false}
                            multiple={false}
                            defaultFiles={[]}
                            withCredentials={false}
                            saveUrl={appGlobalConst.ipfsUploadURL}
                            onBeforeUpload={onBeforeUpload}
                            onStatusChange={onFileUpload1}
                            id={"file_1"}
                            />
                            <p id = "desc_file_1">The score is 10</p>
                        </div>
                        <div className="mb-6">
                          <br />
                          <Field
                            name={"file_2"}
                            component={Upload}
                            label={"Second Document"}
                            autoUpload ={false}
                            batch={false}
                            multiple={false}
                            defaultFiles={[]}
                            withCredentials={false}
                            saveUrl={appGlobalConst.ipfsUploadURL}
                            onBeforeUpload={onBeforeUpload}
                            onStatusChange={onFileUpload2}
                            id={"file_2"}
                            />
                            <p id = "desc_file_2">The score is 50</p>
                        </div>
                        <div className="mb-6">
                          <Field
                            name={"file_3"}
                            component={Upload}
                            label={"Third Document"}
                            autoUpload ={false}
                            batch={false}
                            multiple={false}
                            defaultFiles={[]}
                            withCredentials={false}
                            saveUrl={appGlobalConst.ipfsUploadURL}
                            onBeforeUpload={onBeforeUpload}
                            onStatusChange={onFileUpload3}
                            id={"file_3"}
                            />
                            <p id = "desc_file_2">The score is 30</p>
                        </div>
                      </div>
                    </fieldset>
                    <div className="k-form-buttons">
                      <Button
                        themeColor={"primary"}
                        disabled={!formRenderProps.allowSubmit || isUploading}
                      >
                        Submit
                      </Button>
                      <Button
                        fillMode="outline"
                        themeColor={"info"}
                        onClick={() => { history.push('/') }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </FormElement>
                )}
              />
            </div>
            <div className="box toc"></div>
          </StackLayout>
          <div className="box footer"></div>
        </StackLayout>
      </div>
      {isLoading && (
        <LoadingScreen />
      )}
    </div>
  );
};
export default ServiceProvider;