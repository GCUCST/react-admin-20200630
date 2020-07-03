import React, { Component } from "react";
import { Card, Table, Button, Icon, message, Modal } from "antd";
import LinkButton from "../../components/link-button";
import {
  reqCategories,
  reqAddCategory,
  reqUpdateCategory,
} from "../../api/index";
export default class Category extends Component {
  state = {
    loading: false,
    categorys: [], //一级分类列表
    subCategorys: [], //二级列表
    parentId: "0", //当前需要显示的分类列表的parentId
    parentName: "",//父分类名称
    showStatus:0, //表示添加/更新的确认框是否显示 0都不  1 添加  2更新
  };

  //初始化table列数组
  initColumns = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 300,
        render: (category) => (
          //返回需要显示的界面标签
          <div>
            <LinkButton onClick={this.showUpdate}>修改分类</LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton
                onClick={() => {
                  this.showSubCategorys(category);
                }}
              >
                查看子分类
              </LinkButton>
            ) : null}
          </div>
        ),
      },
    ];
  };
  //    <LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton>
  //    注意这个写法，不这样子写的话，会在运行时候就调用。（如何向事件回调函数传递参数）
  showSubCategorys = (category) => {
    console.log(category);
    //注意这个地方，是异步更新操作
    // this.setState({
    //     parentId:category._id,
    //     parentName:category.name
    // })

    //改成这样子
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        // 这样子写会在状态更新并且重新render后执行
        // 获取二级分类列表
        console.log("pid:" + this.state.parentId);
        this.getCategorys();
      }
    );
  };

  //回退到一级分类列表
  showCategorys = () => {
    this.setState({
      parentId: "0",
      subCategorys: [],
      parentName: "",
    });
  };

  //隐藏所有对话框
  handleCancel = ()=>{
      this.setState({showStatus:0})
  }

  //添加分类
  addCategory = ()=>{
      console.log("addCategory()")

  }

  //更新分类
  updateCategory = ()=>{
    console.log("updateCategory()")
      
  }

  //显示添加框
  showAdd =()=>{
      this.setState({showStatus:1})
  }

    //显示修改框
    showUpdate =()=>{
        this.setState({showStatus:2})
    }


  //一级和二级都能够获取
  getCategorys = async () => {
    //请求前loading
    this.setState({ loading: true });

    const { parentId } = this.state;

    const result = await reqCategories(parentId);
    console.log(result);
    if (result.status === 1) {
      message.error(result.msg);
    } else {
      const categorys = result.data;
      //更新一级分类
      if (parentId === "0") {
        this.setState({
          categorys,
        });
      } else {
        this.setState({
          subCategorys: categorys,
        });
      }
    }
    this.setState({ loading: false });
  };
  componentWillMount() {
    this.initColumns();
  }

  //发请求
  componentDidMount() {
    this.getCategorys();
  }

  render() {
    //读取状态数据
    const {
      categorys,
      subCategorys,
      parentId,
      loading,
      parentName,
    } = this.state;

    //左侧的标题
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon style={{ marginRight: "10px" }} type="arrow-right"></Icon>
          {parentName}
        </span>
      );

    //右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus" />
        添加
      </Button>
    );

    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            loading={loading}
            bordered
            rowKey="_id"
            dataSource={parentId === "0" ? categorys : subCategorys}
            columns={this.columns}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          />
          <Modal
            title="添加分类"
            visible={this.state.showStatus===1}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
          >
            <p>添加分类</p>
          </Modal>
          <Modal
            title="修改分类"
            visible={this.state.showStatus===2}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
          >
            <p>修改分类</p>
       
          </Modal>
        </Card>
      </div>
    );
  }
}
