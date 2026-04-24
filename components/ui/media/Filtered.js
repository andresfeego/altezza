function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

const FILTER_CLASS_MAP = {
  '1977': '_1977',
  _1977: '_1977',
  aden: 'aden',
  brannan: 'brannan',
  brooklyn: 'brooklyn',
  clarendon: 'clarendon',
  earlybird: 'earlybird',
  gingham: 'gingham',
  hudson: 'hudson',
  inkwell: 'inkwell',
  kelvin: 'kelvin',
  lark: 'lark',
  lofi: 'lofi',
  maven: 'maven',
  mayfair: 'mayfair',
  moon: 'moon',
  nashville: 'nashville',
  perpetua: 'perpetua',
  reyes: 'reyes',
  rise: 'rise',
  slumber: 'slumber',
  stinson: 'stinson',
  toaster: 'toaster',
  valencia: 'valencia',
  walden: 'walden',
  willow: 'willow',
  xpro2: 'xpro2',
  xproii: 'xpro2',
  'x-pro-ii': 'xpro2',
};

function resolveFilterClass(filter) {
  if (!filter) return '';
  const normalized = String(filter).trim().toLowerCase();
  return FILTER_CLASS_MAP[normalized] || '';
}

export default function Filtered({
  as = 'figure',
  filter = '',
  className = '',
  children,
  ...rest
}) {
  const Component = as;
  const filterClass = resolveFilterClass(filter);

  return (
    <Component className={joinClasses('fx-filtered', filterClass, className)} {...rest}>
      {children}
    </Component>
  );
}
