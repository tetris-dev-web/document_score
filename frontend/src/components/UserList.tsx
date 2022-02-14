import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";

import '@progress/kendo-theme-default/dist/all.scss';
import '@progress/kendo-theme-default/dist/default-nordic.scss';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { StackLayout } from "@progress/kendo-react-layout";
import { Grid, GridColumn, GridCellProps, GridToolbar, GridDataStateChangeEvent, GridRowClickEvent } from '@progress/kendo-react-grid';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';

import { IUser } from '../interfaces/User';
import { useStores } from "../use-stores";

const UserList = observer(() => {
  const { userStore } = useStores();

  // Load User list for the first time
  useEffect(() => {
    if (userStore.users.length == 0) userStore.getUsers().then(refreshUser);
  }, [userStore]);

  // Local variables
  let history = useHistory();

  // Grid State
  const createDataState = (dataState: State) => {
    return {
      result: process(userStore.users.slice(0), dataState),
      dataState: dataState,
    };
  };

  let initialState = createDataState({
    filter: {
      logic: "and",
      filters: [{ field: "username", operator: "contains", value: "" }],
    },
    sort: [{
      field: "username",
      dir: "asc"
    }],
    take: 8,
    skip: 0,
  });

  // State Defination
  const [allowUnsort, setAllowUnsort] = React.useState<boolean>(true);
  const [multipleSort, setMultipleSort] = React.useState<boolean>(false);
  const [gridDataState, setGridDataState] = React.useState<State>(initialState.dataState);
  const [gridClickedRow, setGridClickedRow] = React.useState<any>({});
  const [result, setResult] = React.useState<DataResult>(initialState.result);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState<boolean>(false);
  const [deletingUserId, setDeletingUserId] = React.useState<number>(0);

  // Load User List
  const refreshUser = () => {
    let updatedState = createDataState(gridDataState);
    setResult(updatedState.result);
  }

  // Event Handler
  const handleGridDataStateChange = (event: GridDataStateChangeEvent) => {
    let updatedState = createDataState(event.dataState);
    setResult(updatedState.result);
    setGridDataState(updatedState.dataState);
  }

  const handleGridRowClick = (event: GridRowClickEvent) => {
    setGridClickedRow(event.dataItem);
  }

  const handleGoEdit = (item: IUser) => {
    history.push('/edit/' + item.id);
  };

  const handleDeleteClick = (item: IUser) => {
    setOpenDeleteDialog(true);
    setDeletingUserId(item.id);
  };

  const handleDeleteConfirm = () => {
  }

  const columnAction = (props: GridCellProps) => {
    return (
      <td>
        <ButtonGroup>
          <Button
            fillMode="outline"
            themeColor={"info"}
            onClick={() => handleGoEdit(props.dataItem)}
          >
            Edit
          </Button>
          <Button
            fillMode="solid"
            themeColor={"primary"}
            onClick={() => handleDeleteClick(props.dataItem)}
          >
            Delete
          </Button>
        </ButtonGroup>
      </td>
    );
  }

  return (
    <>
      <div>
        <div className="page-wrapper page-user">
          <StackLayout orientation="vertical" align={{ vertical: "top" }}>
            <div className="box header"></div>
            <StackLayout orientation="horizontal">
              <div className="box nav"></div>
              <div className="box content">
                <Grid
                  data={result}
                  pageable={true}
                  sortable={{
                    allowUnsort: allowUnsort,
                    mode: multipleSort ? "multiple" : "single",
                  }}
                  filterable={true}
                  {...gridDataState}
                  onDataStateChange={handleGridDataStateChange}
                  onRowClick={handleGridRowClick}
                  style={{ height: "400px" }}>
                  <GridToolbar>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                      title="Add Document"
                      themeColor={"primary"}
                      onClick={() => {history.push('/service_provider')}}
                      >
                      Add Document
                    </Button>
                    <input
                      type="checkbox"
                      className="k-checkbox k-checkbox-md k-rounded-md"
                      id="unsort"
                      checked={allowUnsort}
                      onChange={(event) => {
                        setAllowUnsort(event.target.checked);
                      }}
                    />
                    <label
                      htmlFor="unsort"
                      className="k-checkbox-label"
                      style={{
                        lineHeight: "1.2",
                      }}
                    >
                      Enable unsorting
                    </label>
                    &nbsp;&nbsp;&nbsp;
                    <input
                      type="checkbox"
                      className="k-checkbox k-checkbox-md k-rounded-md"
                      id="multiSort"
                      checked={multipleSort}
                      onChange={(event) => {
                        setMultipleSort(event.target.checked);
                      }}
                    />
                    <label
                      htmlFor="multiSort"
                      className="k-checkbox-label"
                      style={{
                        lineHeight: "1.2",
                      }}
                    >
                      Enable multiple columns sorting
                    </label>
                  </GridToolbar>
                  <GridColumn field="username" title="Username" />
                  <GridColumn field="total_score" title="Total Score" filterable={false} />
                  <GridColumn field="num_document" title="Number of Documents" filterable={false} />
                  <GridColumn cell={columnAction} filterable={false} />
                </Grid>
                {openDeleteDialog && (
                  <Dialog title={"Please confirm to delete"} onClose={() => { setOpenDeleteDialog(false) }}>
                    <p style={{ margin: "25px", textAlign: "center" }}>
                      Are you sure you want to delete?
                    </p>
                    <DialogActionsBar>
                      <Button
                        fillMode="outline"
                        themeColor={"info"}
                        onClick={() => { setOpenDeleteDialog(false) }}
                      >
                        No
                      </Button>
                      <Button
                        themeColor={"primary"}
                        onClick={handleDeleteConfirm}
                      >
                        Yes
                      </Button>
                    </DialogActionsBar>
                  </Dialog>
                )}
              </div>
              <div className="box toc"></div>
            </StackLayout>
            <div className="box footer"></div>
          </StackLayout>
        </div>
      </div>
    </>
  );
});

export default UserList;
