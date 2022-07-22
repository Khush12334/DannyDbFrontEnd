import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { getProducts, selectProducts } from '../store/productsSlice';
import DetailsTagsTableHead from './DetailsTagsTableHead';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';;
import InputAdornment from '@mui/material/InputAdornment';


import { DataGrid, GridRowsProp, GridColDef, renderActionsCell } from '@mui/x-data-grid';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';

const schema = yup.object().shape({
  tagName: yup.string().required('You must enter tage name')
});

const defaultValues = {
  tagName: ''
};

function DetailsTagsTable(props) {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);
  const user = useSelector(({ auth }) => auth.user);
  const routeParams = useParams();

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [dataHeader, setDataHeader] = useState([]);
  const [filter, setFilter] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [menu, setMenu] = useState(null);
  const [saveTag, setSaveTag] = useState({})
  const [total, setTotal] = useState(0)
  const [lastFetch, setLastFetch] = useState(1)
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (searchText.length !== 0) {
      console.log(searchText)
      let arr = [];
      setData([])
      filter.filter(val => {
        if (val?.tags_name?.toLowerCase().includes(searchText?.toLowerCase())) {
          console.log(val)
          arr.push(val)
          setData(arr.concat())
        }
      })
      setPage(0);
    } else {
      setData(filter);
    }
  }, [searchText]);

  useEffect(() => {
    fetchTables("https://dannydb.wirelesswavestx.com/usertaglist")
  }, [])

  const fetchTables = (url) => {
    setLoading(true)
    let formdata = new FormData();
    formdata.append("id", user?.data?.id)
    axios.post(url, formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {
      console.log(result)
      if (result.status == 200) {
        // setTotal(result.data.data.total)
        console.log(result.data.data.length)

        setLoading(false)
        Object.keys(result.data.data[0]).forEach(e => {
          console.log(e)
          const str2 = e.charAt(0).toUpperCase() + e.slice(1);

          dataHeader.push(
            { field: e, headerName: e, minWidth: 100 },
          )

          setDataHeader(dataHeader.concat())
        })

        console.log(dataHeader)
        setData(result.data.data.concat())
        setFilter(result.data.data.concat())
      } else {
        setLoading(false)
      }
    })
  }

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });

    if (order.direction == 'asc') {
      function compare(a, b) {
        if (a[property] < b[property]) {
          return -1;
        }
        if (a[property] > b[property]) {
          return 1;
        }
        return 0;
      }
      data.sort(compare)
    }
    if (order.direction == 'desc') {
      function compare(a, b) {
        if (a[property] > b[property]) {
          return -1;
        }
        if (a[property] < b[property]) {
          return 1;
        }
        return 0;
      }
      data.sort(compare)
    }
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      // setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    // props.navigate(`/apps/e-commerce/products/${item.id}/${item.handle}`);
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  const langMenuClose = () => {
    setSaveTag({})
    setMenu(null);
  };

  function handleChangePage(event, value) {

    let next = value + 1
    if (lastFetch < next) {
      loadMoreData("https://dannydb.wirelesswavestx.com/gettable?page=" + next)
      setLastFetch(next)
    }
    setPage(value);
  }

  const loadMoreData = (url) => {
    setLoading(true)
    let formdata = new FormData();
    formdata.append("id", 1)
    formdata.append("table_name", routeParams.detailsName)
    axios.post(url, formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {
      console.log(result.data.data)
      if (result.status == 200) {
        setLoading(false)
        setData(result.data.data.data.concat())
        setFilter(result.data.data.data.concat())
      } else {
        setLoading(false)
      }
    })
  }

  const deletetags = () => {
    console.log(saveTag)
    let formdata = new FormData();
    formdata.append("id", user?.data?.id)
    formdata.append("tags_id", saveTag.tags_id)
    axios.post('https://dannydb.wirelesswavestx.com/deletetag', formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {
      console.log(result)

      if (result.status == 200) {
        setMenu(false)
        delete data[saveTag]
        setData(data.concat())
        delete filter[saveTag]
        setFilter(filter.concat())

      }
    })
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no products!
        </Typography>
      </motion.div>
    );
  }

  function onSubmit(model) {
    console.log(saveTag, routeParams, user, model)
    let formdata = new FormData();
    formdata.append("id", user.data.id)
    formdata.append("tablename", routeParams.detailsName)
    formdata.append("tags_name", model.tagName)
    formdata.append("columnname", 'id')
    formdata.append("row_id", saveTag.id)
    // axios.post('https://dannydb.wirelesswavestx.com/savetag', formdata, {
    axios.post('https://dannydb.wirelesswavestx.com/usertaglist', formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {
      if (result.status == 200) {
        console.log(result)
        langMenuClose()
      }
    })

  }

  const columns: GridColDef[] = [
    {
      field: 'delete',
      minWidth: 100,
      renderCell: (params) => {
        return <Button
          onClick={() => {
            setMenu(true)
            setSaveTag(params.row)
          }}
          className={clsx('w-40 h-40', props.className)}
          size="large"
        >
          <Icon>{'delete'}</Icon>
        </Button>
      }
    },
    ...dataHeader
  ];

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="grow overflow-x-auto">

        <DataGridPro
          rowHeight={25}
          // apiRef={apiRef}
          rows={data}
          columns={columns}
          rowsPerPageOptions={[30]}
          page={page}
          rowCount={total}
          getRowId={(row) => row.tags_id}
          onPageChange={handleChangePage}
          onCellClick={(e) => { console.log(e) }}
          style={{ fontSize: 12 }}
          pagination={false}
        />



        < Popover
          open={Boolean(menu)}
          anchorEl={menu}
          onClose={langMenuClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: 'py-8',
          }}
        >
          <div style={{ padding: 10 }}>
            <Typography>Are you sure you want to delete?</Typography>
            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <IconButton
                aria-haspopup="true"
                onClick={langMenuClose}
                size="small"
              >
                <p style={{ color: 'grey', fontSize: 15 }}>Close</p>
              </IconButton>
              <IconButton
                aria-haspopup="true"
                onClick={() => {
                  setMenu(true)
                  // setSaveTag(n)
                  deletetags()
                }}
                size="small"
              >
                <p style={{ color: 'red', fontSize: 15 }}>Delete</p>
              </IconButton>
            </div>
          </div>
        </Popover>
      </FuseScrollbars>

    </div >
  );
}

export default withRouter(DetailsTagsTable);
