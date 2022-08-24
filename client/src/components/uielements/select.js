import React from 'react';
import { Select } from 'antd';
import { AntSelect } from './styles/select.style';
import WithDirection from '@iso/lib/helpers/rtl';

const SelectOption = Select.Option;
const CustomSelect = (props) => <Select {...props} />

const WDSelect = AntSelect(CustomSelect);
const isoSelect = WithDirection(WDSelect);

export default isoSelect;
export { SelectOption };
