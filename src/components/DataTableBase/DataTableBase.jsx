import DataTableModule from "react-data-table-component";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
//import styles from "./datatablebase.module.scss";
import styled from "styled-components";

const DataTable = DataTableModule.default ?? DataTableModule;

const selectableRowsComponentProps = {
  indeterminate: (isIndeterminate) => (isIndeterminate ? true : undefined),
};

const StyledIcon = styled(ArrowDropDownIcon)`
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  opacity: ${({ $sortActive }) => ($sortActive ? 1 : 0)};
  transform: ${({ $sortDirection }) =>
    $sortDirection === "desc" ? "rotate(180deg)" : "rotate(0deg)"};
`;

const MuiSortIcon = ({ sortActive, sortDirection }) => {
  return (
    <StyledIcon
      $sortActive={sortActive}
      $sortDirection={sortDirection}
      fontSize="small"
    />
  );
};

function DataTableBase(props) {
  return (
    <DataTable
      pagination
      dense
      highlightOnHover
      responsive
      sortIcon={<MuiSortIcon />}
      selectableRowsComponentProps={selectableRowsComponentProps}
      {...props}
    />
  );
}

export default DataTableBase;
