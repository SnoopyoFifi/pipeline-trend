import type {ItemType} from './types' 

const mockData: ItemType[] = [
  { "year": "2024", "month": "Jan", "value": 0 },
  { "year": "2024", "month": "Feb", "value": 121825 },
  { "year": "2024", "month": "Mar", "value": 270360 },
  { "year": "2024", "month": "Apr", "value": 55502 },
  { "year": "2024", "month": "May", "value": 124809 },
  { "year": "2024", "month": "Jun", "value": 9356 },
  { "year": "2024", "month": "Jul", "value": 327102 },
  { "year": "2024", "month": "Aug", "value": 152020 },
  { "year": "2024", "month": "Sep", "value": 137550 },
  { "year": "2024", "month": "Oct", "value": 342030 },
  { "year": "2024", "month": "Nov", "value": 598309 },
  { "year": "2024", "month": "Dec", "value": 365664 },
  { "year": "2025", "month": "Jan", "value": 664117 },
  { "year": "2025", "month": "Feb", "value": 1394574 },
  { "year": "2025", "month": "Mar", "value": 345740 },
  { "year": "2025", "month": "Apr", "value": 335975 },
  { "year": "2025", "month": "May", "value": 82040 },
  { "year": "2025", "month": "Jun", "value": 46880 }
]


const MONTH_ORDER: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};
export{ mockData, MONTH_ORDER}