import React from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";

import '@progress/kendo-theme-default/dist/all.scss';
import '@progress/kendo-theme-default/dist/default-nordic.scss';
import { Button} from '@progress/kendo-react-buttons';

const NotFound = observer(() => {
  let history = useHistory();

  return (
    <>
      <div >
        Page not found.
        <br />
        <br />
      </div>
      <Button
        fillMode="outline"
        themeColor={"info"}
        onClick={() => {history.push('/')}}
      >
        Go to User List
      </Button>
    </>
  );
});

export default NotFound;
