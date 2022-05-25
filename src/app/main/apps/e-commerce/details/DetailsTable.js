// import FuseScrollbars from '@fuse/core/FuseScrollbars';
// import _ from '@lodash';
// import Checkbox from '@mui/material/Checkbox';
// import Icon from '@mui/material/Icon';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';
// import clsx from 'clsx';
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';

// import { useDispatch, useSelector } from 'react-redux';
// import withRouter from '@fuse/core/withRouter';
// import FuseLoading from '@fuse/core/FuseLoading';
// import { getProducts, selectProducts } from '../store/productsSlice';
// import ProductsTableHead from './ProductsTableHead';

// function ProductsTable(props) {
//   const dispatch = useDispatch();
//   const products = useSelector(selectProducts);
//   const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);

//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState([]);
//   const [data, setData] = useState(products);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [order, setOrder] = useState({
//     direction: 'asc',
//     id: null,
//   });

//   useEffect(() => {
//     dispatch(getProducts()).then(() => setLoading(false));
//   }, [dispatch]);

//   useEffect(() => {
//     if (searchText.length !== 0) {
//       setData(
//         _.filter(products, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
//       );
//       setPage(0);
//     } else {
//       setData(products);
//     }
//   }, [products, searchText]);

//   function handleRequestSort(event, property) {
//     const id = property;
//     let direction = 'desc';

//     if (order.id === property && order.direction === 'desc') {
//       direction = 'asc';
//     }

//     setOrder({
//       direction,
//       id,
//     });
//   }

//   function handleSelectAllClick(event) {
//     if (event.target.checked) {
//       setSelected(data.map((n) => n.id));
//       return;
//     }
//     setSelected([]);
//   }

//   function handleDeselect() {
//     setSelected([]);
//   }

//   function handleClick(item) {
//     props.navigate(`/apps/e-commerce/products/${item.id}/${item.handle}`);
//   }

//   function handleCheck(event, id) {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }

//     setSelected(newSelected);
//   }

//   function handleChangePage(event, value) {
//     setPage(value);
//   }

//   function handleChangeRowsPerPage(event) {
//     setRowsPerPage(event.target.value);
//   }

//   if (loading) {
//     return <FuseLoading />;
//   }

//   if (data.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1, transition: { delay: 0.1 } }}
//         className="flex flex-1 items-center justify-center h-full"
//       >
//         <Typography color="textSecondary" variant="h5">
//           There are no products!
//         </Typography>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="w-full flex flex-col">
//       <FuseScrollbars className="grow overflow-x-auto">
//         <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
//           <ProductsTableHead
//             selectedProductIds={selected}
//             order={order}
//             onSelectAllClick={handleSelectAllClick}
//             onRequestSort={handleRequestSort}
//             rowCount={data.length}
//             onMenuItemClick={handleDeselect}
//           />

//           <TableBody>
//             {_.orderBy(
//               data,
//               [
//                 (o) => {
//                   switch (order.id) {
//                     case 'categories': {
//                       return o.categories[0];
//                     }
//                     default: {
//                       return o[order.id];
//                     }
//                   }
//                 },
//               ],
//               [order.direction]
//             )
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((n) => {
//                 const isSelected = selected.indexOf(n.id) !== -1;
//                 return (
//                   <TableRow
//                     className="h-72 cursor-pointer"
//                     hover
//                     role="checkbox"
//                     aria-checked={isSelected}
//                     tabIndex={-1}
//                     key={n.id}
//                     selected={isSelected}
//                     onClick={(event) => handleClick(n)}
//                   >
//                     {/* <TableCell className="w-40 md:w-64 text-center" padding="none">
//                       <Checkbox
//                         checked={isSelected}
//                         onClick={(event) => event.stopPropagation()}
//                         onChange={(event) => handleCheck(event, n.id)}
//                       />
//                     </TableCell> */}

//                     <TableCell
//                       className="w-52 px-4 md:px-0"
//                       component="th"
//                       scope="row"
//                       padding="none"
//                     >
//                       {n.images.length > 0 && n.featuredImageId ? (
//                         <img
//                           className="w-full block rounded"
//                           src={_.find(n.images, { id: n.featuredImageId }).url}
//                           alt={n.name}
//                         />
//                       ) : (
//                         <img
//                           className="w-full block rounded"
//                           src="assets/images/ecommerce/product-image-placeholder.png"
//                           alt={n.name}
//                         />
//                       )}
//                     </TableCell>

//                     <TableCell className="p-4 md:p-16" component="th" scope="row">
//                       {n.name}
//                     </TableCell>

//                     <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
//                       {n.categories.join(', ')}
//                     </TableCell>

//                     <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
//                       <span>$</span>
//                       {n.priceTaxIncl}
//                     </TableCell>

//                     <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
//                       {n.quantity}
//                       <i
//                         className={clsx(
//                           'inline-block w-8 h-8 rounded mx-8',
//                           n.quantity <= 5 && 'bg-red',
//                           n.quantity > 5 && n.quantity <= 25 && 'bg-orange',
//                           n.quantity > 25 && 'bg-green'
//                         )}
//                       />
//                     </TableCell>

//                     <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
//                       {n.active ? (
//                         <Icon className="text-green text-20">check_circle</Icon>
//                       ) : (
//                         <Icon className="text-red text-20">remove_circle</Icon>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </FuseScrollbars>

//       <TablePagination
//         className="shrink-0 border-t-1"
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         backIconButtonProps={{
//           'aria-label': 'Previous Page',
//         }}
//         nextIconButtonProps={{
//           'aria-label': 'Next Page',
//         }}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// }

// export default withRouter(ProductsTable);

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
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
import DetailsTableHead from './DetailsTableHead';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

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
        if (val.table_name.toLowerCase().includes(searchText.toLowerCase())) {
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
        Object.keys(result.data.data.data[0]).forEach(e => {
          const str2 = e.charAt(0).toUpperCase() + e.slice(1);
          dataHeader.push(
            {
              id: e,
              align: 'left',
              disablePadding: false,
              label: str2.replace(/_/g, ' '),
              sort: true,
            }
            // e
          )

          setDataHeader(dataHeader.concat())
        })

        console.log(dataHeader)
        setData(result.data.data.data.concat())
        setFilter(result.data.data.data.concat())
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

  function handleChangePage(event, value) {
    // let whenDataFetch = ((value + 1) * rowsPerPage) % 30

    // if (whenDataFetch == 0) {
    //   loadMoreData("https://dannydb.wirelesswavestx.com/gettable?page=" + )
    //   console.log(data.length)
    // }
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

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
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
              //   _.orderBy(
              //   data,
              //   [
              //     (o) => {
              //       switch (order.id) {
              //         case 'categories': {
              //           return o.categories[0];
              //         }
              //         default: {
              //           return o[order.id];
              //         }
              //       }
              //     },
              //   ],
              //   [order.direction]
              // )
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => {
                  // const isSelected = selected.indexOf(n.id) !== -1;
                  console.log(n)
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
                      {/* <TableCell className="w-40 md:w-64 text-center" padding="none">
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n.id)}
                      />
                    </TableCell> */}

                      {/* <TableCell
                      className="w-52 px-4 md:px-0"
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {n.images.length > 0 && n.featuredImageId ? (
                        <img
                          className="w-full block rounded"
                          src={_.find(n.images, { id: n.featuredImageId }).url}
                          alt={n.name}
                        />
                      ) : (
                        <img
                          className="w-full block rounded"
                          src="assets/images/ecommerce/product-image-placeholder.png"
                          alt={n.name}
                        />
                      )}
                    </TableCell> */}
                      {
                        dataHeader.map(e => {

                          return (
                            <TableCell className="p-4 md:p-16" component="th" scope="row">
                              {n[e.id]}
                            </TableCell>
                          )
                        })
                      }


                      {/* <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                      {n.categories.join(', ')}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      <span>$</span>
                      {n.priceTaxIncl}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      {n.quantity}
                      <i
                        className={clsx(
                          'inline-block w-8 h-8 rounded mx-8',
                          n.quantity <= 5 && 'bg-red',
                          n.quantity > 5 && n.quantity <= 25 && 'bg-orange',
                          n.quantity > 25 && 'bg-green'
                        )}
                      />
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      {n.active ? (
                        <Icon className="text-green text-20">check_circle</Icon>
                      ) : (
                        <Icon className="text-red text-20">remove_circle</Icon>
                      )}
                    </TableCell> */}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 30]}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(DetailsTable);
