import React from 'react'
import { Table, Popconfirm, Layout, Button, message, Modal, Badge, Breadcrumb } from "antd";
import axios from '../../component/axios'
import ProjectEditForm from './edit'
import moment from 'moment'

export default class ProjectPage extends React.Component {
    columns = [
        {
            title: '应用名称',
            dataIndex: 'name',
            width: 180,
            editable: true,
        },
        {
            title: 'AppSecret',
            width: 300,
            dataIndex: 'identify'
        },
        {
            title: '公开',
            width: 80,
            dataIndex: 'shared',
            render: (text) => {
                return <Badge status={text ? 'success' : 'default'} text={text ? '公开' : '私有'} />;
            }
        },
        {
            dataIndex: 'updateTime',
            title: '更新时间',
            width: 175,
            render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '操作',
            dataIndex: 'orderno',
            render: (text, record) => {
                return (<span>
                    < Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)
                    }>
                        <a>删除</a>
                    </Popconfirm >
                    <a style={{ marginLeft: 5 }} onClick={() => this.onEdit(record)}>编辑</a>
                    <Popconfirm placement="topRight"
                        title="确定重置？" onConfirm={() => this.resetAppSecret(record)}>
                        <a style={{ marginLeft: 5, color: "#e02a31" }}>重置AppSecret</a>
                    </Popconfirm>

                </span>
                )
            }
        }
    ];

    state = {
        loading: false,
        listData: [],
        editItem: {
            visible: false,
            data: {}
        }
    }

    onEdit = (record) => {
        this.setState({ editItem: { visible: true, data: record } })
    }

    componentDidMount() {
        this.getAppList();
    }

    // 获应用列表
    getAppList = () => {
        return axios.get('/project/list', {}).then(result => {
            if (result.code != 0) {
                return
            }
            this.setState({ listData: result.data, loading: false, editItem: { visible: false, data: {} } })
        })
    }

    handleDelete = (record) => {
        return axios.post("/project/delete/" + record.id).then(result => {
            if (result.code == 0) {
                const dataSource = [...this.state.listData];
                this.setState({ listData: dataSource.filter(item => item.id !== record.id) });
                message.success("刪除成功");
            } else {
                message.error(result.error);
            }
        })
    }

    onCancel = () => {
        const { editItem } = this.state
        this.setState({ editItem: { ...editItem, visible: false } })
    }

    onSave = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            this.submit(values, () => {
                form.resetFields()
                this.getAppList()
            });
        });
    }

    resetAppSecret = (record) => {
        return axios.post("/project/appsecret/reset", record).then(result => {
            if (result.code == 0) {
                message.success("重置成功");
                this.getAppList()
            } else {
                message.error(result.error);
            }
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef
    }

    submit = (values, callback) => {
        if (values.id == undefined) {
            values.id = 0
            values.identify = "unknown"
        }
        return axios.post('/project/update', values).then(result => {
            if (result.code == 0) {
                message.success("保存成功")
                callback()
            } else {
                message.error(result.error)
            }
        });
    }

    render() {
        const { loading, listData, editItem } = this.state
        return (
            <Layout>
                <Breadcrumb style={{ marginBottom: 12 }}>
                    <Breadcrumb.Item>
                        <a href="/">首页</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>应用管理</Breadcrumb.Item>
                </Breadcrumb>

                <Button type="primary" style={{ width: 80, marginBottom: 12 }} onClick={() => this.onEdit({})}>添加</Button>
                <Modal
                    visible={editItem.visible}
                    title={editItem.data == null ? "新增" : "修改"}
                    cancelText="取消"
                    okText="保存"
                    onCancel={this.onCancel}
                    onOk={this.onSave}
                >
                    <ProjectEditForm wrappedComponentRef={this.saveFormRef} data={editItem.data || {}}></ProjectEditForm>
                </Modal>
                <Table rowKey="id" loading={loading} dataSource={listData} columns={this.columns}></Table>
            </Layout>
        )
    }

}