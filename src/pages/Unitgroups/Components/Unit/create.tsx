import LangTextItemFrom from '@/components/LangTextItem/from';
import styles from '@/style/custom.less';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import {
    Button,
    Card,
    Drawer,
    Form,
    Input,
    Space,
    Switch,
    Tooltip,
    Typography,
} from 'antd';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'umi';

type Props = {
    onData: (data: any) => void;
};
const UnitCreate: FC<Props> = ({ onData }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const formRefCreate = useRef<ProFormInstance>();
    const [fromData, setFromData] = useState<any>({});

    useEffect(() => {
        if (drawerVisible) return;
        formRefCreate.current?.resetFields();
        formRefCreate.current?.setFieldsValue({});
        setFromData({});
    }, [drawerVisible]);

    return (
        <>
            <Tooltip title={<FormattedMessage id="pages.button.create" defaultMessage="Create"></FormattedMessage>}>
                <Button
                    size={'middle'}
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setDrawerVisible(true);
                    }}
                ></Button>
            </Tooltip>
            <Drawer
                title={<FormattedMessage id="pages.unitgroup.unit.drawer.title.create" defaultMessage="Unit Create"></FormattedMessage>}
                width="90%"
                closable={false}
                extra={
                    <Button
                        icon={<CloseOutlined />}
                        style={{ border: 0 }}
                        onClick={() => {
                            setDrawerVisible(false);
                        }}
                    ></Button>
                }
                maskClosable={false}
                open={drawerVisible}
                onClose={() => {
                    setDrawerVisible(false);
                }}
                footer={
                    <Space size={'middle'} className={styles.footer_right}>
                        <Button onClick={() => {
                            setDrawerVisible(false);
                        }}>
                            <FormattedMessage id="pages.button.cancel" defaultMessage="Cancel"></FormattedMessage>
                        </Button>
                        <Button onClick={() => {
                            formRefCreate.current?.submit();
                        }} type="primary">
                            <FormattedMessage id="pages.button.submit" defaultMessage="Submit"></FormattedMessage>
                        </Button>
                    </Space>
                }
            >
                <ProForm
                    formRef={formRefCreate}
                    onValuesChange={(_, allValues) => {
                        setFromData(allValues);
                    }}
                    submitter={{
                        render: () => {
                            return [];
                        },
                    }}
                    onFinish={async () => {
                        onData({ ...fromData });
                        formRefCreate.current?.resetFields();
                        setDrawerVisible(false);
                        return true;
                    }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Form.Item name={'@dataSetInternalID'} hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Name" name={'name'}>
                            <Input />
                        </Form.Item>
                        <Card size="small" title={'General Comment'}>
                            <LangTextItemFrom name={'generalComment'} label={'General Comment'} />
                        </Card>
                        <Form.Item label="Mean Value" name={'meanValue'}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Quantitative Reference" name={'quantitativeReference'}>
                            <Switch></Switch>
                        </Form.Item>
                    </Space>
                </ProForm>
                <Typography>
                    <pre>{JSON.stringify(fromData, null, 2)}</pre>
                </Typography>
            </Drawer>
        </>
    );
};

export default UnitCreate;
