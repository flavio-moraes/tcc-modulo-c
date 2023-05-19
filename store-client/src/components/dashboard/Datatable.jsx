import styled from "styled-components";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  ptBR,
} from "@mui/x-data-grid";

const Container = styled.div`
  width: clamp(600px, calc(100% - 40px), 1042px);
  height: 667px;
  padding: 20px;
  color: gray;

  .cellWithImg {
    display: flex;
    align-items: center;

    .cellImg {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 20px;
    }

    .cellImgPr {
      width: 44px;
      height: 44px;
      border-radius: 20%;
      object-fit: cover;
      margin-right: 20px;
    }
  }

  .cellWithStatus {
    padding: 5px;
    border-radius: 5px;

    &.active,
    &.approved {
      background-color: rgba(0, 128, 0, 0.05);
      color: green;
    }
    &.pending {
      background-color: rgba(255, 217, 0, 0.05);
      color: goldenrod;
    }
    &.passive {
      background-color: rgba(255, 0, 0, 0.05);
      color: crimson;
    }
  }

  .cellAction {
    display: flex;
    align-items: center;
    gap: 15px;

    .viewButton {
      padding: 2px 5px;
      border-radius: 5px;
      color: darkblue;
      border: 1px solid rgba(0, 0, 139, 0.596);
      cursor: pointer;
    }

    .deleteButton {
      padding: 2px 5px;
      border-radius: 5px;
      color: crimson;
      border: 1px solid rgba(220, 20, 60, 0.6);
      cursor: pointer;
    }

    .editButton {
      padding: 2px 5px;
      border-radius: 5px;
      color: #7b14dc;
      border: 1px solid rgba(173, 20, 220, 0.6);
      cursor: pointer;
    }
  }
`;

const Datatable = (props) => {
  props.config.rows = props.config.rows || [];
  props.config.columns = props.config.columns || {
    field: "none",
    headerName: "Coluna",
    width: 980,
  };
  props.config.selectionModel = props.config.selectionModel || [];
  props.config.setSelectionModel =
    props.config.setSelectionModel ||
    function (arg) {
      return;
    };
  props.config.checkbox = props.config.checkbox || false;
  props.config.clickSelection = props.config.clickSelection || false;
  props.config.disableVirtualization =
    process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === "test";

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{
            fileName: props.config.exportOptions.filename,
            fields: props.config.exportOptions.columns,
            delimiter: ";",
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <Container>
      <DataGrid
        className="datagrid"
        rows={props.config.rows}
        columns={props.config.columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={props.config.checkbox}
        disableSelectionOnClick={!props.config.clickSelection}
        autoHeight={false}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        components={props.config.exportOptions && { Toolbar: CustomToolbar }}
        onSelectionModelChange={(newSelectionModel) => {
          props.config.setSelectionModel(newSelectionModel);
        }}
        selectionModel={props.config.selectionModel}
        disableVirtualization={props.config.disableVirtualization}
      />
    </Container>
  );
};
export default Datatable;
