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
import { Icon } from '@progress/kendo-react-common';
import LoadingScreen from "./LoadingScreen";
import appGlobalConst from '../config';

import { IUser } from '../interfaces/User';
import { useStores } from "../use-stores";
import { NumericTextBoxPropsContext } from "@progress/kendo-react-inputs";

const UserList = observer(() => {
  const { userStore } = useStores();

  // Load User list for the first time
  useEffect(() => {
    setIsLoading(true);
    userStore.getUsers().then(() => {
      setIsLoading(false);
      refreshUser();
    });
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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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


  const columnDownload = (props: GridCellProps) => {
    const field = props.field || "";
    const value = props.dataItem[field];
  
    return (
      <td>
        {value.map((item:any, i:number) => {
          return (<a href = {appGlobalConst.ipfsLinkURL + item} target = "new"><Icon name = 'download' ></Icon></a> );
        })}
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
                    <Button
                      title="Home"
                      themeColor={"info"}
                      onClick={() => { history.push('/') }}
                    >
                      Home
                    </Button>
                    <Button
                      title="Add Document"
                      themeColor={"primary"}
                      onClick={() => { history.push('/service_provider') }}
                    >
                      Add Document
                    </Button>
                    &nbsp;&nbsp;&nbsp;
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
                  <GridColumn field="documents" cell={columnDownload} filterable={false} />
                </Grid>
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
    </>
  );
});

export default UserList;
