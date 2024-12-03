type DropdownOption = {
    label: string;
    value: string;
    disabled?: boolean;
  };
  
  const dropdownOptions: DropdownOption[] = [
    {
      label: 'Choose a grouping',
      value: '',
      disabled: true, // Prevent selection of this default option
    },
    {
      label: 'by Minute',
      value: 'minute',
    },
    {
      label: 'by HOUR',
      value: 'hour',
    },
    {
      label: 'by AM/PM',
      value: 'half-day',
    },
    {
      label: 'by DAY',
      value: 'day',
    },
    {
      label: 'by MONTH',
      value: 'month',
    },
    {
      label: 'All time',
      value: 'all-time',
    },
  ];
  
  export default dropdownOptions;
  