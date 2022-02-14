// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentScore {

    struct Document {
        string id; // file id in IPFS
        uint256 score;
    }

    struct UserDocument {
        string userName;
        Document[] documents;
    }

    mapping (string => Document[]) private userToDocuments;
    string[] private users;

    event DocumentAdded(string userName, uint256 docAmount);

    function addDocuments(string memory _userName, Document[] memory _documents) external {
        if (userToDocuments[_userName].length == 0) {
            users.push(_userName);
        }

        for (uint256 i = 0; i < _documents.length; i++) {
            userToDocuments[_userName].push(Document(_documents[i].id, _documents[i].score));
        }

        emit DocumentAdded(_userName, userToDocuments[_userName].length);
    }

    function getUserDocuments() external view returns (UserDocument[] memory) {
        UserDocument[] memory userDocuments = new UserDocument[](users.length);

        for (uint256 i = 0; i < users.length; i++) {
            userDocuments[i] = UserDocument(users[i], userToDocuments[users[i]]);
        }

        return userDocuments;
    }
}