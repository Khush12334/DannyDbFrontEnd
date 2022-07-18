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
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { getProducts, selectProducts } from '../store/productsSlice';
import DetailsTableHead from './DetailsTableHead';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';;
import InputAdornment from '@mui/material/InputAdornment';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

import { DataGrid, GridRowsProp, GridColDef, renderActionsCell } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
const schema = yup.object().shape({
    tagName: yup.string().required('You must enter tage name')
});

const defaultValues = {
    tagName: ''
};

function DetailsTable(props) {
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
    const [menuPdf, setMenuPdf] = useState(null);
    const [showPop, setShowPop] = useState(false);
    const [saveTag, setSaveTag] = useState({})
    const [showLable, setShowLabel] = useState({})
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

    // useEffect(() => {
    //   dispatch(getProducts()).then(() => setLoading(false));
    // }, [dispatch]);

    useEffect(() => {
        if (searchText.length !== 0) {
            // setData(
            //   _.filter(data, (item) => console.log(item))
            // );
            console.log(searchText)
            let arr = [];
            setData([])
            filter.filter(val => {
                console.log(val)
                if (val?.issuername?.toLowerCase().includes(searchText?.toLowerCase())) {
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
        // console.log(JSON.parse(routeParams.detailsName))
        // setDataHeader(JSON.parse(routeParams.detailsName))
        fetchTables("https://dannydb.wirelesswavestx.com/gettable")
    }, [])


    const fetchTables = (url) => {
        return new Promise((resolve, reject) => {
            setLoading(true)
            let formdata = new FormData();
            formdata.append("id", user?.data?.id)
            formdata.append("table_name", routeParams.detailsName)
            axios.post(url, formdata, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(result => {
                console.log(result)
                if (result.status == 200) {
                    setTotal(result.data.data.total)
                    setLoading(false)
                    console.log(result.data.data)
                    Object.keys(result.data.data.data[0]).forEach(e => {
                        const str2 = e.charAt(0).toUpperCase() + e.slice(1);
                        dataHeader.push(
                            // {
                            //   id: e,
                            //   align: 'left',
                            //   disablePadding: false,
                            //   label: str2.replace(/_/g, ' '),
                            //   sort: true,
                            // }
                            { field: e, headerName: e, minWidth: 100 },
                            // e
                        )

                        setDataHeader(dataHeader.concat())
                    })
                    setData(result.data.data.data.concat())
                    setFilter(result.data.data.data.concat())
                    console.log("dataHeader / data", dataHeader, result.data.data.data)
                    resolve(result.data);
                } else {
                    setLoading(false)
                    reject()
                }
            })
        });
    }

    const sizing = (id) => {
        console.log(id)
        let formdata = new FormData();
        formdata.append("id", id)
        formdata.append("type", "sources-and-uses")
        axios.post(`http://18.117.231.22/sizer_api/prepare_file.php?`, formdata, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(result => {
            console.log("res", result)
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

    const langMenuPdfClose = () => {
        setMenuPdf(null);
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
        formdata.append("id", user?.data?.id)
        formdata.append("table_name", routeParams.detailsName)
        axios.post(url, formdata, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(async result => {
            console.log(result)
            var arr = []
            if (result.status == 200) {
                setLoading(false)
                setData(data.concat(result.data.data.data))
                setFilter(filter.concat(result.data.data.data))
            } else {
                setLoading(false)
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
        axios.post('https://dannydb.wirelesswavestx.com/savetag', formdata, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(result => {
            if (result.status == 200) {
                console.log(result)
                langMenuClose()
                model.tagName = ''
            }
        })

    }
    const columns: GridColDef[] = [
        ...dataHeader,
        {
            field: 'save',
            minWidth: 100,
            renderCell: (params) => {
                const onSaveClick = (e) => {
                    console.log(params)
                    setMenu(true)
                    setSaveTag(params.row)
                    setShowLabel({
                        lable: "Tag Name",
                        head: "tag"
                    })
                };
                const onNotesClick = (e) => {
                    console.log(params.row)
                    setMenu(true)
                    setSaveTag(params.row)
                    setShowLabel({
                        lable: "Enter Notes",
                        head: "notes"
                    })
                }
                return <div style={{
                    display: 'flex', margin: 10
                }
                } >
                    <Tooltip title="Save tag" placement="bottom">
                        <IconButton size='small' onClick={onSaveClick}>
                            <Icon>{'save'}</Icon>
                            {/* <Typography>{"Save"}</Typography> */}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Save notes" placement="bottom">
                        <IconButton size='small' onClick={onNotesClick}>
                            <Icon>{'description'}</Icon>
                            {/* <Typography>{"Notes"}</Typography> */}
                        </IconButton>
                    </Tooltip>
                </div >;
            }
        },
        {
            field: 'download',
            minWidth: 100,
            renderCell: (params) => {
                return <Tooltip title="Download PDF" placement="bottom">
                    <IconButton
                        onClick={() => {
                            setMenuPdf(true)
                        }}
                        className={clsx('w-40 h-40', props.className)}
                        size='small'
                    >
                        <Icon>{'download'}</Icon>
                    </IconButton>
                </Tooltip>
            }
        },
    ];


    return (
        <div className="w-full flex flex-col">
            <FuseScrollbars className="grow overflow-x-auto">
                <DataGridPro
                    rowHeight={25}
                    rows={data}
                    columns={columns}
                    // rowsPerPageOptions={[30]}
                    // page={page}
                    // rowCount={total}
                    // onPageChange={handleChangePage}
                    onCellClick={(e) => { console.log(e), setShowPop(true) }}
                    style={{ fontSize: 12 }}
                    pagination={false}
                />
                {/* <Table fixedHeader={false} style={{ tableLayout: "auto" }}>
          <DetailsTableHead
            // selectedProductIds={selected}
            headers={dataHeader}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {
              _.orderBy(
                dataHeader,
                [
                  (o) => {
                    switch (order.id) {
                      case 'categories': {
                        return o.categories[0];
                      }
                      default: {
                        return o[order.id];
                      }
                    }
                  },
                ],
                [order.direction]
              ),
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => {
                  // const isSelected = selected.indexOf(n.id) !== -1;
                  return (
                    <TableRow
                      className="h-72 cursor-pointer"
                      hover
                      role="checkbox"
                      // aria-checked={isSelected}
                      tabIndex={-1}
                      key={index}
                      // selected={isSelected}
                      onClick={(event) => handleClick(n)}
                    >
                      <TableCell className="w-40 md:w-60 text-center" padding="none">
                        <Tooltip title="Save tag" placement="bottom">
                          <IconButton
                            onClick={() => {
                              setMenu(true)
                              setSaveTag(n)
                              setShowLabel({
                                lable: "Tag Name",
                                head: "tag"
                              })
                            }}
                            className={clsx('w-40 h-40', props.className)}
                            size="large"
                          >
                            <Icon>{'save'}</Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Save notes" placement="bottom">
                          <IconButton
                            onClick={() => {
                              setMenu(true)
                              setSaveTag(n)
                              setShowLabel({
                                lable: "Enter Notes",
                                head: "notes"
                              })
                            }}
                            className={clsx('w-40 h-40', props.className)}
                            size="large"
                          >
                            <Icon>{'description'}</Icon>
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      <TableCell className="p-4 md:p-16" component="th" scope="row">
                        <Tooltip title="Download PDF" placement="bottom">
                          <IconButton
                            onClick={() => {
                              setMenuPdf(true)
                            }}
                            className={clsx('w-40 h-40', props.className)}
                            size="large"
                          >
                            <Icon>{'download'}</Icon>
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      {
                        dataHeader.map(e => {

                          return (
                            <TableCell className="p-4 md:p-16" component="th" scope="row">

                              {n[e.id]}
                            </TableCell>
                          )
                        })
                      }
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table> */}
                <Popover
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
                    <div className="w-full mb-16" style={{ padding: 10 }} onSubmit={handleSubmit(onSubmit)}>
                        <form className="flex flex-col justify-center w-full" >
                            <p style={{ color: '#000', fontSize: 15, margin: 10, textAlign: 'center' }}>{`Save with ${showLable.head}`}</p>
                            <Controller
                                name="tagName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        className="mb-16"
                                        type="text"
                                        error={!!errors.tagName}
                                        helperText={errors?.tagName?.message}
                                        label={showLable.lable}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Icon className="text-20" color="action">
                                                        user
                                                    </Icon>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                    />
                                )}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="w-full mx-auto mt-16"
                                aria-label="LOG IN"
                                disabled={_.isEmpty(dirtyFields) || !isValid}
                                value="legacy"
                            >
                                Save
                            </Button>
                        </form>
                    </div>
                </Popover>
                <Popover
                    open={Boolean(menuPdf)}
                    anchorEl={menuPdf}
                    onClose={langMenuPdfClose}
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
                    <div className="flex flex-col justify-center w-full mb-16" style={{ padding: 10 }} >

                        <Button
                            className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
                            onClick={() => {
                                setMenuPdf(false)
                                // setSaveTag(n)
                            }}
                            color="inherit"
                        >
                            <Icon>{'download'}</Icon>
                            <Typography>{"Refinance Comparison"}</Typography>
                        </Button>

                        <Button
                            className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
                            onClick={() => {
                                setMenuPdf(false)
                                // setSaveTag(n)
                            }}
                            color="inherit"
                        >
                            <Icon>{'download'}</Icon>
                            <Typography>{"Proposed Sources & Uses"}</Typography>
                        </Button>
                        <Button
                            className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
                            onClick={() => {
                                setMenuPdf(false)
                                // setSaveTag(n)
                            }}
                            color="inherit"
                        >
                            <Icon>{'download'}</Icon>
                            <Typography>{"Sizing"}</Typography>
                        </Button>
                    </div>
                </Popover>

            </FuseScrollbars>

            {/* <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[30]}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showLastButton={true}
        showFirstButton={true}
      /> */}
        </div >
    );
}

export default withRouter(DetailsTable);

