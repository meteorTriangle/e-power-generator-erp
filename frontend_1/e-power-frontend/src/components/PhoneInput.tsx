import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'large' | 'middle' | 'small';
}

interface CountryCode {
  code: string;
  label: string;
  country: string;
  maxLength: number;
}

const countryCodes: CountryCode[] = [
  { code: '+886', label: '台灣', country: 'TW', maxLength: 10 },
//   { code: '+1', label: '美國/加拿大', country: 'US', maxLength: 10 },
//   { code: '+86', label: '中國', country: 'CN', maxLength: 11 },
//   { code: '+852', label: '香港', country: 'HK', maxLength: 8 },
//   { code: '+853', label: '澳門', country: 'MO', maxLength: 8 },
//   { code: '+65', label: '新加坡', country: 'SG', maxLength: 8 },
//   { code: '+60', label: '馬來西亞', country: 'MY', maxLength: 10 },
//   { code: '+81', label: '日本', country: 'JP', maxLength: 10 },
//   { code: '+82', label: '韓國', country: 'KR', maxLength: 10 },
//   { code: '+44', label: '英國', country: 'GB', maxLength: 10 },
//   { code: '+61', label: '澳洲', country: 'AU', maxLength: 9 },
];

// 國旗圖標組件 - 使用 SVG
const FlagIcon: React.FC<{ country: string }> = ({ country }) => {
  const countryCodeLower = country.toLowerCase();
  
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCodeLower}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCodeLower}.png 2x`}
      alt={country}
      style={{
        width: '24px',
        height: '16px',
        objectFit: 'cover',
        marginRight: '8px',
        borderRadius: '2px',
        border: '1px solid #e0e0e0',
      }}
    />
  );
};

const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value = '', 
  onChange, 
  placeholder = '請輸入手機號碼',
  size = 'large' 
}) => {
  // 解析初始值
  const parsePhone = (phone: string) => {
    if (!phone) return { countryCode: '+886', number: '' };
    
    const matchedCountry = countryCodes.find(c => phone.startsWith(c.code));
    if (matchedCountry) {
      return {
        countryCode: matchedCountry.code,
        number: phone.slice(matchedCountry.code.length)
      };
    }
    return { countryCode: '+886', number: phone };
  };

  const [countryCode, setCountryCode] = useState(parsePhone(value).countryCode);
  const [phoneNumber, setPhoneNumber] = useState(parsePhone(value).number);

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const fullPhone = code + phoneNumber;
    onChange?.(fullPhone);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 只允許數字
    const num = e.target.value.replace(/\D/g, '');
    
    // 獲取當前國碼的最大長度限制
    const currentCountry = countryCodes.find(c => c.code === countryCode);
    const maxLen = currentCountry?.maxLength || 15;
    
    // 限制長度
    const limitedNum = num.slice(0, maxLen);
    setPhoneNumber(limitedNum);
    
    const fullPhone = countryCode + limitedNum;
    onChange?.(fullPhone);
  };

  // 格式化顯示的號碼（添加空格分隔）
  const formatDisplayNumber = (num: string) => {
    if (!num) return '';
    
    // 台灣手機號碼格式：0912 345 678
    if (countryCode === '+886') {
        // cellphone: 09XX XXX XXX
        if (num.startsWith('09')) {
            return num.replace(/09(\d{2})(\d{3})(\d{3})/, '09$1 $2 $3').trim();
        }
        // taipei(02): (02)XXXX XXXX
        if (num.startsWith('02')) {
            return num.replace(/02(\d{4})(\d{4})/, '(02)$1 $2').trim();
        }
        // miaoli(037): (037)XX XXXX
        if (num.startsWith('037')) {
            return num.replace(/037(\d{2})(\d{4})/, '(037)$1 $2').trim();
        }
        // taoyuan, hsinchu, hualien, Yilan(03)
        // (03): (03)XXX XXXX
        if (num.startsWith('03')) {
            return num.replace(/03(\d{3})(\d{4})/, '(03)$1 $2').trim();
        }
        // nantou(049): (049)XXX XXXX
        if (num.startsWith('049')) {
            return num.replace(/049(\d{3})(\d{4})/, '(049)$1 $2').trim();
        }
        // taichung(04): (04)XXXX XXXX
        if (num.startsWith('04') && num.length === 10) {
            return num.replace(/04(\d{4})(\d{4})/, '(04)$1 $2').trim();
        }
        // changhua(04): (04)XXX XXXX
        if (num.startsWith('04') && num.length === 9) {
            return num.replace(/04(\d{3})(\d{4})/, '(04)$1 $2').trim();
        }
        // jiayi, yunlin(05): (05)XXX XXXX
        if (num.startsWith('05')) {
            return num.replace(/05(\d{3})(\d{4})/, '(05)$1 $2').trim();
        }
        // tainan, penghu(06): (06)XXX XXXX
        if (num.startsWith('06')) {
            return num.replace(/06(\d{3})(\d{4})/, '(06)$1 $2').trim();
        }
        // kaohsiung(07): (07)XXX XXXX
        if (num.startsWith('07')) {
            return num.replace(/07(\d{3})(\d{4})/, '(07)$1 $2').trim();
        }
        // lienchiang(0836): (0836)X XXXX
        if (num.startsWith('0836')) {
            return num.replace(/0836(\d)(\d{4})/, '(0836)$1 $2').trim();
        }
        // kinmen wuqiu(0826): (0826)X XXXX
        if (num.startsWith('0826')) {
            return num.replace(/0826(\d)(\d{4})/, '(0826)$1 $2').trim();
        }
        // kinmen(082) (082)XX XXXX
        if (num.startsWith('082')) {
            return num.replace(/082(\d{2})(\d{4})/, '(082)$1 $2').trim();
        }
        // Taitung(089): (089)XX XXXX
        if (num.startsWith('089')) {
            return num.replace(/089(\d{2})(\d{4})/, '(089)$1 $2').trim();
        }
        // pingtung(08): (08)XXX XXXX
        if (num.startsWith('08')) {
            return num.replace(/08(\d{3})(\d{4})/, '(08)$1 $2').trim();
        }
        // default fallback
        return num.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3').trim();
    }
    
    // 美國/加拿大格式：(123) 456-7890
    if (countryCode === '+1') {
      return num.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3').trim();
    }
    
    // 其他格式：每4位數加空格
    return num.replace(/(\d{4})/g, '$1 ').trim();
  };

  const getCurrentCountry = () => {
    return countryCodes.find(c => c.code === countryCode);
  };

  const currentCountry = getCurrentCountry();

  return (
    <Input
      addonBefore={
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '140px' }}>
          {currentCountry && <FlagIcon country={currentCountry.country} />}
          <Select
            value={countryCode}
            onChange={handleCountryChange}
            bordered={false}
            size={size}
            showSearch
            optionFilterProp="label"
            style={{ flex: 1, minWidth: '90px' }}
            dropdownStyle={{ minWidth: '250px' }}
          >
            {countryCodes.map(country => (
              <Select.Option 
                key={country.code} 
                value={country.code}
                label={`${country.label} ${country.code}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FlagIcon country={country.country} />
                  <span style={{ fontWeight: '500' }}>{country.code}</span>
                  <span style={{ marginLeft: '8px', color: '#666' }}>{country.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      }
      prefix={<PhoneOutlined />}
      value={formatDisplayNumber(phoneNumber)}
      onChange={handleNumberChange}
      placeholder={placeholder}
      size={size}
    />
  );
};

export default PhoneInput;
