import React, { Component } from 'react'
import products_data from "./product_data.json"
import ReactTable from "react-table-6"; 
import 'react-table-6/react-table.css';
import TableFilter from 'react-table-filter';
import 'react-table-filter/lib/styles.css';
import withRouter from '@fuse/core/withRouter';
import axios from 'axios';

export default withRouter(class ProductsTable extends Component {
  constructor(props){
    super(props)
    this.state = {
      'user': this.props.user,
      'updatedData': products_data
    };
    this._filterUpdated = this._filterUpdated.bind(this);
    this.fetchTables = this.fetchTables.bind(this);
  }

  _filterUpdated(newData, filtersObject) {
    this.setState({
      'updatedData': newData,
    });
  }

 fetchTables = (url) => {
    return new Promise((resolve, reject) => {
      // setLoading(true)
      let formdata = new FormData();
      formdata.append("id", this.state.user?.data?.id)
      // formdata.append("table_name", routeParams.detailsName)
      formdata.append("table_name", "ginnie_data")
      axios.post(url, formdata, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(result => {
        console.log(result)
        if (result.status == 200) {
          // setTotal(result.data.data.total)
          // setLoading(false)
          // Object.keys(result.data.data.data[0]).forEach(e => {
            // const str2 = e.charAt(0).toUpperCase() + e.slice(1);
            // dataHeader.push(
            //   {
            //     id: e,
            //     align: 'left',
            //     disablePadding: false,
            //     label: str2.replace(/_/g, ' '),
            //     sort: true,
            //   }
            //   // e
            // )

            // setDataHeader(dataHeader.concat())
          // })

          // console.log(dataHeader)
          // setData(result.data.data.data.concat())
          // setFilter(result.data.data.data.concat())
          resolve(result.data);
        } else {
          // setLoading(false)
          reject()
        }
      })
    });
 
}
componentWillMount(){
  
    // console.log(JSON.parse(routeParams.detailsName))
    // setDataHeader(JSON.parse(routeParams.detailsName))
    this.fetchTables("https://dannydb.wirelesswavestx.com/gettable")

}
  render() {

    const updatedData = this.state.updatedData;
    const columns = [{  
      Header: 'Features',  
      accessor: 'features',
     }
     
    ,{  
        Header: 'ID',  
        accessor: '_id' ,
    }
    ,{  
     Header: 'Name',  
     accessor: 'name',
     },
     {  
      Header: 'Description',  
      accessor: 'description',
      },
      {  
      Header: 'Category',  
      accessor: 'category',
      }
      ,{  
        Header: 'Subcategory',  
        accessor: 'subcategory',
    }
    ,{  
     Header: 'CreatedAt',  
     accessor: 'createdAt',
     },
     {  
      Header: 'UpdatedAt',  
      accessor: 'updatedAt',
      },
      {  
      Header: 'V',  
      accessor: '__v',
      }
      ,{  
        Header: 'ModelId',  
        accessor: 'modelId' ,
    }
    ,{  
     Header: 'PID',  
     accessor: 'pid',
     },
     {  
      Header: 'Datasheet',  
      accessor: 'datasheet',
      },
      {  
      Header: 'Link',  
      accessor: 'link',
      }
      ,{  
        Header: 'Thumbnail',  
        accessor: 'thumbnail' ,
    }
  ]

  return (
    <div>
      <ReactTable  
    defaultPageSize={10}
    data={updatedData} 
    columns={columns}  
 />
 <TableFilter
  rows={updatedData}
  onFilterUpdate={this._filterUpdated}>
  <th key="category" filterkey="category" className="cell" casesensitive={'true'} showsearch={'true'}>
    Category
  </th>
  <th filterkey="subcategory">
    Subcategory
  </th>
</TableFilter>
    </div>
  )
  }
});
