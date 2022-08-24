import { Calendar } from 'antd';
import AntCalendar from './FullCalendar.style';
import WithDirection from '@iso/lib/helpers/rtl';

const WDFullCalendar = AntCalendar(Calendar);
const FullCalendar = WithDirection(WDFullCalendar);

export default FullCalendar;
