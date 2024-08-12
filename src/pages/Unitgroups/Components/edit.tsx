import LangTextItemFrom from '@/components/LangTextItem/from';
import LevelTextItemFrom from '@/components/LevelTextItem/from';
import SourceSelectFrom from '@/pages/Sources/Components/select/from';
import { ListPagination } from '@/services/general/data';
import { getUnitGroupDetail, updateUnitGroup } from '@/services/unitgroups/api';
import { UnitTable } from '@/services/unitgroups/data';
import { genUnitGroupFromData, genUnitTableData } from '@/services/unitgroups/util';
import styles from '@/style/custom.less';
import {
  CheckCircleTwoTone,
  CloseCircleOutlined,
  CloseOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Card,
  Collapse,
  Drawer,
  Form,
  Input,
  Space,
  Spin,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'umi';
import UnitCreate from './Unit/create';
import UnitDelete from './Unit/delete';
import UnitEdit from './Unit/edit';
import UnitView from './Unit/view';

type Props = {
  id: string;
  buttonType: string;
  lang: string;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  setViewDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const UnitGroupEdit: FC<Props> = ({ id, buttonType, lang, actionRef, setViewDrawerVisible }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const formRefEdit = useRef<ProFormInstance>();
  const [activeTabKey, setActiveTabKey] = useState<string>('unitGroupInformation');
  const [initData, setInitData] = useState<any>({});
  const [fromData, setFromData] = useState<any>({});
  const [unitDataSource, setUnitDataSource] = useState<readonly UnitTable[]>([]);
  const [spinning, setSpinning] = useState(false);

  const actionRefUnitTable = useRef<ActionType>();

  const handletFromData = () => {
    setFromData({
      ...fromData,
      [activeTabKey]: formRefEdit.current?.getFieldsValue()?.[activeTabKey] ?? {},
    });
  };

  const handletUnitDataCreate = (data: any) => {
    setUnitDataSource([
      ...unitDataSource,
      { ...data, '@dataSetInternalID': unitDataSource.length.toString() },
    ]);
  };

  const handletUnitData = (data: any) => {
    setUnitDataSource([...data]);
  };

  const tabList = [
    {
      key: 'unitGroupInformation',
      tab: (
        <FormattedMessage
          id="pages.unitgroup.edit.unitGroupInformation"
          defaultMessage="UnitGroup Information"
        />
      ),
    },
    {
      key: 'modellingAndValidation',
      tab: (
        <FormattedMessage
          id="pages.unitgroup.edit.modellingAndValidation"
          defaultMessage="Modelling And Validation"
        />
      ),
    },
    {
      key: 'administrativeInformation',
      tab: (
        <FormattedMessage
          id="pages.unitgroup.edit.administrativeInformation"
          defaultMessage="Administrative Information"
        />
      ),
    },
    {
      key: 'units',
      tab: <FormattedMessage id="pages.unitgroup.edit.units" defaultMessage="Units" />,
    },
  ];

  const unitColumns: ProColumns<UnitTable>[] = [
    {
      title: (
        <FormattedMessage id="pages.table.title.index" defaultMessage="Index"></FormattedMessage>
      ),
      valueType: 'index',
      search: false,
    },
    // {
    //     title: <FormattedMessage id="pages.unitgroup.unit.dataSetInternalID" defaultMessage="DataSet Internal ID"></FormattedMessage>,
    //     dataIndex: 'dataSetInternalID',
    //     search: false,
    // },
    {
      title: (
        <FormattedMessage id="pages.table.title.name" defaultMessage="Name"></FormattedMessage>
      ),
      dataIndex: 'name',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.unitgroup.unit.generalComment"
          defaultMessage="General Comment"
        ></FormattedMessage>
      ),
      dataIndex: 'generalComment',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.unitgroup.unit.meanValue"
          defaultMessage="Mean Value"
        ></FormattedMessage>
      ),
      dataIndex: 'meanValue',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.unitgroup.unit.quantitativeReference"
          defaultMessage="Quantitative Reference"
        />
      ),
      dataIndex: 'quantitativeReference',
      sorter: false,
      search: false,
      render: (_, row) => {
        if (row.quantitativeReference) {
          return <CheckCircleTwoTone twoToneColor="#52c41a" />;
        }
        return <CloseCircleOutlined />;
      },
    },
    {
      title: (
        <FormattedMessage id="pages.table.title.option" defaultMessage="Option"></FormattedMessage>
      ),
      valueType: 'option',
      search: false,
      render: (_, row) => {
        return [
          <Space size={'small'} key={0}>
            <UnitView id={row.dataSetInternalID} data={unitDataSource} buttonType={'icon'} />
            <UnitEdit
              id={row.dataSetInternalID}
              data={unitDataSource}
              buttonType={'icon'}
              actionRef={actionRefUnitTable}
              onData={handletUnitData}
              setViewDrawerVisible={() => {}}
            />
            <UnitDelete
              id={row.dataSetInternalID}
              data={unitDataSource}
              buttonType={'icon'}
              actionRef={actionRefUnitTable}
              setViewDrawerVisible={() => {}}
              onData={handletUnitData}
            />
          </Space>,
        ];
      },
    },
  ];

  const contentList: Record<string, React.ReactNode> = {
    unitGroupInformation: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          size="small"
          title={
            <FormattedMessage
              id="pages.unitgroup.edit.unitGroupInformation.name"
              defaultMessage="Name"
            />
          }
        >
          <LangTextItemFrom
            name={['unitGroupInformation', 'dataSetInformation', 'common:name']}
            label={
              <FormattedMessage
                id="pages.unitgroup.edit.unitGroupInformation.name"
                defaultMessage="Name"
              />
            }
          ></LangTextItemFrom>
        </Card>
        <Card
          size="small"
          title={
            <FormattedMessage
              id="pages.unitgroup.edit.unitGroupInformation.classification"
              defaultMessage="Classification"
            />
          }
        >
          <LevelTextItemFrom
            name={[
              'unitGroupInformation',
              'dataSetInformation',
              'classificationInformation',
              'common:classification',
              'common:class',
            ]}
            dataType={'UnitGroup'}
            formRef={formRefEdit}
            onData={handletFromData}
          />
        </Card>
        <Form.Item
          label="ID" //这是翻译哪一个
          name={['unitGroupInformation', 'dataSetInformation', 'common:UUID']}
          hidden
        >
          <Input></Input>
        </Form.Item>
      </Space>
    ),
    modellingAndValidation: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <SourceSelectFrom
          name={[
            'modellingAndValidation',
            'complianceDeclarations',
            'compliance',
            'common:referenceToComplianceSystem',
          ]}
          label={
            <FormattedMessage
              id="pages.unitgroup.edit.modellingAndValidation.referenceToComplianceSystem"
              defaultMessage="Reference To Compliance System"
            />
          }
          lang={lang}
          formRef={formRefEdit}
          onData={handletFromData}
        />
        <Form.Item
          label={
            <FormattedMessage
              id="pages.unitgroup.edit.modellingAndValidation.approvalOfOverallCompliance"
              defaultMessage="Approval Of Overall Compliance"
            />
          }
          name={[
            'modellingAndValidation',
            'complianceDeclarations',
            'compliance',
            'common:approvalOfOverallCompliance',
          ]}
        >
          <Input></Input>
        </Form.Item>
      </Space>
    ),
    administrativeInformation: (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form.Item
          label={
            <FormattedMessage
              id="pages.unitgroup.edit.administrativeInformation.timeStamp"
              defaultMessage="Time Stamp"
            />
          }
          name={['administrativeInformation', 'dataEntryBy', 'common:timeStamp']}
        >
          <Input disabled={true} style={{ color: '#000' }} />
        </Form.Item>
        <SourceSelectFrom
          name={['administrativeInformation', 'dataEntryBy', 'common:referenceToDataSetFormat']}
          label={
            <FormattedMessage
              id="pages.unitgroup.edit.administrativeInformation.referenceToDataSetFormat"
              defaultMessage="Reference To DataSet Format"
            />
          }
          lang={lang}
          formRef={formRefEdit}
          onData={handletFromData}
        />
        <Form.Item
          label={
            <FormattedMessage
              id="pages.unitgroup.edit.administrativeInformation.dataSetVersion"
              defaultMessage="DataSet Version"
            />
          }
          name={['administrativeInformation', 'publicationAndOwnership', 'common:dataSetVersion']}
        >
          <Input />
        </Form.Item>
      </Space>
    ),
    units: (
      <ProTable<UnitTable, ListPagination>
        actionRef={actionRefUnitTable}
        search={{
          defaultCollapsed: false,
        }}
        pagination={{
          showSizeChanger: false,
          pageSize: 10,
        }}
        toolBarRender={() => {
          return [<UnitCreate key={0} onData={handletUnitDataCreate}></UnitCreate>];
        }}
        dataSource={genUnitTableData(unitDataSource, lang)}
        columns={unitColumns}
      ></ProTable>
    ),
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const onEdit = useCallback(() => {
    setDrawerVisible(true);
  }, [setViewDrawerVisible]);

  const onReset = () => {
    setSpinning(true);
    formRefEdit.current?.resetFields();
    getUnitGroupDetail(id).then(async (result: any) => {
      setUnitDataSource(result.data?.json?.unitGroupDataSet?.units?.unit ?? []);
      setSpinning(false);
    });
  };

  useEffect(() => {
    if (!drawerVisible) return;
    setSpinning(true);
    getUnitGroupDetail(id).then(async (result: any) => {
      setInitData({ ...genUnitGroupFromData(result.data?.json?.unitGroupDataSet ?? {}), id: id });
      setFromData({
        ...genUnitGroupFromData(result.data?.json?.unitGroupDataSet ?? {}),
        id: id,
      });
      setUnitDataSource(
        genUnitGroupFromData(result.data?.json?.unitGroupDataSet ?? {})?.units?.unit ?? [],
      );
      formRefEdit.current?.resetFields();
      formRefEdit.current?.setFieldsValue({
        ...genUnitGroupFromData(result.data?.json?.unitGroupDataSet ?? {}),
        id: id,
      });
      setSpinning(false);
    });
  }, [drawerVisible]);

  useEffect(() => {
    setFromData({
      ...fromData,
      units: {
        unit: [...unitDataSource],
      },
    });
  }, [unitDataSource]);

  // useEffect(() => {
  //     if (activeTabKey === 'units') return;
  //     setFromData({
  //         ...fromData,
  //         [activeTabKey]: formRefEdit.current?.getFieldsValue()?.[activeTabKey] ?? {},
  //     });
  // }, [formRefEdit.current?.getFieldsValue()]);

  return (
    <>
      {buttonType === 'icon' ? (
        <Tooltip
          title={<FormattedMessage id="pages.button.edit" defaultMessage="Edit"></FormattedMessage>}
        >
          <Button shape="circle" icon={<FormOutlined />} size="small" onClick={onEdit}></Button>
        </Tooltip>
      ) : (
        <Button size="small" onClick={onEdit}>
          <FormattedMessage id="pages.button.edit" defaultMessage="Edit"></FormattedMessage>
        </Button>
      )}

      <Drawer
        title={
          <FormattedMessage
            id="pages.unitgroup.drawer.title.edit"
            defaultMessage="Edit"
          ></FormattedMessage>
        }
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
        maskClosable={true}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
        footer={
          <Space size={'middle'} className={styles.footer_right}>
            <Button
              onClick={() => {
                setDrawerVisible(false);
              }}
            >
              <FormattedMessage id="pages.button.cancel" defaultMessage="Cancel"></FormattedMessage>
            </Button>
            <Button onClick={onReset}>
              <FormattedMessage id="pages.button.reset" defaultMessage="Reset"></FormattedMessage>
            </Button>
            <Button
              onClick={() => {
                formRefEdit.current?.submit();
              }}
              type="primary"
            >
              <FormattedMessage id="pages.button.submit" defaultMessage="Submit"></FormattedMessage>
            </Button>
          </Space>
        }
      >
        <Spin spinning={spinning}>
          <ProForm
            formRef={formRefEdit}
            initialValues={initData}
            onValuesChange={(_, allValues) => {
              setFromData({ ...fromData, [activeTabKey]: allValues[activeTabKey] ?? {} });
            }}
            submitter={{
              render: () => {
                return [];
              },
            }}
            onFinish={async () => {
              const updateResult = await updateUnitGroup({ ...fromData, id });
              if (updateResult?.data) {
                message.success(
                  <FormattedMessage
                    id="options.createsuccess"
                    defaultMessage="Created Successfully!"
                  ></FormattedMessage>,
                );
                setDrawerVisible(false);
                setViewDrawerVisible(false);
                setActiveTabKey('unitGroupInformation');
                actionRef.current?.reload();
              } else {
                message.error(updateResult?.error?.message);
              }
              return true;
            }}
          >
            <Card
              style={{ width: '100%' }}
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={onTabChange}
            >
              {contentList[activeTabKey]}
            </Card>
          </ProForm>
          <Collapse
            items={[
              {
                key: '1',
                label: 'JSON Data',
                children: (
                  <Typography>
                    <pre>{JSON.stringify(fromData, null, 2)}</pre>
                  </Typography>
                ),
              },
            ]}
          />
        </Spin>
      </Drawer>
    </>
  );
};

export default UnitGroupEdit;
