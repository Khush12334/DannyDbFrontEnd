import FuseNavigation from '@fuse/core/FuseNavigation';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNavigation } from 'app/store/fuse/navigationSlice';
import { navbarCloseMobile } from '../../store/fuse/navbarSlice';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

function Navigation(props) {
  const user = useSelector(({ auth }) => auth.user);
  const navigation = useSelector(selectNavigation);
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const [sideMenuList, setSideMenuList] = useState([])

  console.log(navigation)

  useEffect(() => {
    let arr = [
      { id: 'e-commerce-details', title: 'Dashboard', type: 'item', url: 'apps/mortgage/details/ginnie_data', end: true },
      { id: 'e-commerce-tags', title: 'Tags', type: 'item', url: 'apps/mortgage/detailsTags/tags', end: true }
    ]
    setSideMenuList(arr.concat())

  }, [])

  function handleItemClick(item) {
    if (mdDown) {
      dispatch(navbarCloseMobile());
    }
  }

  return (
    <>
      <div className="hidden md:flex flex-col mx-4 items-center justify-center pt-24 pb-24 mb-32 z-0 shadow-0">
        {
          user.data.photoURL ? (
            <Avatar className="avatar w-72 h-72  box-content" alt="user photo" src={user.data.photoURL} />
          ) : (
            <Avatar className="avatar w-72 h-72  box-content">{user.data.displayName[0]}</Avatar>
          )
        }
        <Typography component="span" className="font-semibold flex">
          {user.data.displayName}
        </Typography>
        <Typography className="text-11 font-medium " color="textSecondary">
          {user.data.email.toString()}
        </Typography>


      </div>
      <FuseNavigation
        className={clsx('navigation', props.className)}
        navigation={sideMenuList}
        layout={props.layout}
        dense={props.dense}
        active={props.active}
        onItemClick={handleItemClick}
      />
    </>
  );
}

Navigation.defaultProps = {
  layout: 'vertical',
};

export default memo(Navigation);
