import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { styled } from '@mui/material/styles';
import reducer from '../store';
import DetailsHeader from './DetailsHeader';
// import DetailsTable from './DetailsTable';
import ProductsTable from './../products/ProductsTable';
import {  useSelector } from 'react-redux';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },
  '& .FusePageCarded-content': {
    display: 'flex',
  },
  '& .FusePageCarded-contentCard': {
    overflow: 'hidden',
  },
}));

function Details() {
  const user = useSelector(({ auth }) => auth.user);

  // return <Root header={<DetailsHeader />} content={<DetailsTable />} innerScroll />;
  return <Root header={<DetailsHeader />} content={<ProductsTable user={user} />} innerScroll />;
}

export default withReducer('eCommerceApp', reducer)(Details);
