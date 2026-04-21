import { Fragment, useCallback, useEffect, useState } from 'react'
import { Button, Input, Popconfirm, Space, Table, Tag, message } from 'antd'
import { useIntl } from 'react-intl'
import deviceService from '@/services/device/deviceService'
import DeviceForm from './DeviceForm'
import styles from './index.module.scss'

const DeviceList = () => {
    const intl = useIntl()
    const t = (id) => intl.formatMessage({ id })

    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // 拉列表（被搜索/分页/增删改触发）
    const fetchList = useCallback(
        async (overrides = {}) => {
            setLoading(true)
            try {
                const params = {
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    keyword,
                    ...overrides
                }
                const { data } = await deviceService.fetchList(params)
                setList(data?.data?.list || [])
                setPagination((p) => ({ ...p, total: data?.data?.total || 0 }))
            } catch (err) {
                // xhr 实例已统一处理过，这里不用再 message.error
            } finally {
                setLoading(false)
            }
        },
        [pagination.current, pagination.pageSize, keyword]
    )

    useEffect(() => {
        fetchList()
    }, [fetchList])

    const handleAdd = () => {
        setEditing(null)
        setModalOpen(true)
    }

    const handleEdit = (record) => {
        setEditing(record)
        setModalOpen(true)
    }

    const handleDelete = async (record) => {
        await deviceService.remove(record.id)
        message.success(t('common.delete.success'))
        fetchList()
    }

    const handleSubmit = async (values) => {
        setSubmitting(true)
        try {
            if (editing) {
                await deviceService.update(editing.id, values)
            } else {
                await deviceService.create(values)
            }
            message.success(t('common.save.success'))
            setModalOpen(false)
            fetchList()
        } finally {
            setSubmitting(false)
        }
    }

    const columns = [
        {
            dataIndex: 'name',
            key: 'name',
            title: t('device.list.column.name')
        },
        {
            dataIndex: 'model',
            key: 'model',
            title: t('device.list.column.model')
        },
        {
            dataIndex: 'status',
            key: 'status',
            render: (v) => (
                <Tag color={v === 'online' ? 'green' : 'default'}>{t(`device.status.${v}`)}</Tag>
            ),
            title: t('device.list.column.status')
        },
        {
            dataIndex: 'createdAt',
            key: 'createdAt',
            title: t('device.list.column.createdAt')
        },
        {
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleEdit(record)} type="link">
                        {t('device.list.action.edit')}
                    </Button>
                    <Popconfirm
                        onConfirm={() => handleDelete(record)}
                        title={t('device.list.confirm.delete')}
                    >
                        <Button danger type="link">
                            {t('device.list.action.delete')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            title: t('device.list.column.actions')
        }
    ]

    return (
        <Fragment>
            <div className={styles.toolbar}>
                <Input.Search
                    allowClear
                    className={styles.search}
                    onSearch={(v) => {
                        setKeyword(v)
                        setPagination((p) => ({ ...p, current: 1 }))
                    }}
                    placeholder={t('device.list.search.placeholder')}
                />
                <Button onClick={handleAdd} type="primary">
                    {t('device.list.button.add')}
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={list}
                loading={loading}
                onChange={(p) =>
                    setPagination((prev) => ({ ...prev, current: p.current, pageSize: p.pageSize }))
                }
                pagination={pagination}
                rowKey="id"
            />

            <DeviceForm
                confirmLoading={submitting}
                editing={editing}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                open={modalOpen}
            />
        </Fragment>
    )
}

export default DeviceList
