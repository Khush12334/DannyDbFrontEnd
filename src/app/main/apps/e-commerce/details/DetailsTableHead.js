import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/system';
import TableHead from '@mui/material/TableHead';
import { removeProducts } from '../store/productsSlice';

const rows = [
  {
    id: 'tablename',
    align: 'left',
    disablePadding: false,
    label: 'Table Name',
    sort: true,
  },
];

function DetailsTableHead(props) {
  const { selectedProductIds, headers } = props;
  // const numSelected = selectedProductIds.length;

  // const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);


  const dispatch = useDispatch();

  useEffect(() => {
    console.log(headers, "props.headers")
  }, [])

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event.currentTarget, property);
  };

  function openSelectedProductsMenu(event) {
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
  }

  return (
    <TableHead>

      <TableRow className="h-48 sm:h-64">
        <TableCell padding="none" className="w-40 md:w-64 text-center z-99">
        </TableCell>
        <TableCell aria-expanded={true} padding="none" className="w-40 md:w-64 text-center z-99">
          {"Download"}
        </TableCell>

        {headers.map((row) => {
          // console.log(row)
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
              aria-expanded={true}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default DetailsTableHead;
