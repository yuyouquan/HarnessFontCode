import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { useIntl } from 'react-intl'

const DeviceForm = (props) => {
    const { open, editing, onCancel, onSubmit, confirmLoading } = props
    const intl = useIntl()
    const [form] = Form.useForm()

    // editing 变化时填充表单；关闭时清空
    useEffect(() => {
        if (open) {
            form.setFieldsValue(editing || { status: 'online' })
        } else {
            form.resetFields()
        }
    }, [open, editing, form])

    const t = (id) => intl.formatMessage({ id })

    const handleOk = async () => {
        const values = await form.validateFields()
        onSubmit(values)
    }

    const titleKey = editing ? 'device.form.title.edit' : 'device.form.title.create'

    return (
        <Modal
            cancelText={t('common.cancel')}
            confirmLoading={confirmLoading}
            okText={t('common.save')}
            onCancel={onCancel}
            onOk={handleOk}
            open={open}
            title={t(titleKey)}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={t('device.form.field.name')}
                    name="name"
                    rules={[{ message: t('device.form.required.name'), required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t('device.form.field.model')}
                    name="model"
                    rules={[{ message: t('device.form.required.model'), required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={t('device.form.field.status')} name="status">
                    <Select
                        options={[
                            { label: t('device.status.online'), value: 'online' },
                            { label: t('device.status.offline'), value: 'offline' }
                        ]}
                    />
                </Form.Item>

                <Form.Item label={t('device.form.field.remark')} name="remark">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default DeviceForm
