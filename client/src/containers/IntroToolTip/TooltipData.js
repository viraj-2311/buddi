export const MAX_STEP = 100;
export const TypeUser = {
  PRODUCER: 'Producer',
  COMPANY: 'Company',
};
export const StepsIntroPersonalProducer = {
  PersonalAccount: 0,
  HoldMemo: 1,
  BookingMemo: 2,
  Completed: 3,
  Wallet: 4,
  Finance: 5,
  PersonalNetwork: 6,
  CreateCompany: 7,
};

export const StepsIntroCompanyProducer = {
  PersonalAccount: 0,
  HoldMemo: 1,
  BookingMemo: 2,
  Completed: 3,
  Wallet: 4,
  Document: 5,
  CompanyNetwork: 6,
  CreateCompany: 7,
};

export const TooltipDataPersonal = [
  {
    id: 0,
    title: 'Personal Account',
    placement: 'rightTop',
    desc: `This is your personal badge, here you can accept gigs from other talents, know your memo status, create invoices and access your Buddi Wallet.`,
  },
  {
    id: 1,
    title: 'Hold Memo',
    placement: 'bottom',
    desc: `This is where you would receive Hold memos as a freelancer.`,
  },
  {
    id: 2,
    title: 'Booking Memo',
    placement: 'bottom',
    desc: `This is where you would receive Booking Memos as a freelancer`,
  },
  {
    id: 3,
    title: 'Completed',
    placement: 'bottom',
    desc: `Completed will give you a summary of your gigs that are paid and completed. You can move these to archived at any time.`,
  },
  {
    id: 4,
    title: 'Buddi Wallet',
    placement: 'bottomLeft',
    desc: `Click here to view your Buddi Wallet. You can also start your setup here to get paid faster. It's secure and easy.`,
  },
  {
    id: 5,
    title: 'Finance',
    placement: 'bottomLeft',
    desc: `This is where you would receive requests for Invoices and show what's paid and not paid. Buddi Systems even creates your invoices for you so you have more time to start your next gig.`,
  },
  {
    id: 6,
    title: 'Personal Network',
    placement: 'bottomLeft',
    desc: `Add your favorite talent to this area so you can recommend people and stay connected on your next gig.`,
  },
  {
    id: 7,
    title: 'Create Band',
    placement: 'rightTop',
    desc: `Click here if you would like to invite a production band onto the platform for free. This will help you book talent for your gig.`,
  },
];

export const TooltipDataCompanyProducer = [
  {
    id: 0,
    title: 'Band Account',
    placement: 'rightTop',
    desc: `This is your band badge. This will help you book talent for your gig.`,
  },
  {
    id: 1,
    title: 'Holding Gigs',
    placement: 'bottom',
    desc: `Hold all your key talent here. You can send Hold memos to your favorite key talent and even build out your 1st, 2nd and 3rd choice people. Buddi will do the rest.`,
  },
  {
    id: 2,
    title: 'Active Gigs',
    placement: 'bottom',
    desc: `Create booking memos and check them before you send. Buddi Systems allows you to create booking memos so your talent can be on the same page with rates, hours and details on the shoot`,
  },
  {
    id: 3,
    title: 'Wrap/Pay Gigs',
    placement: 'bottom',
    desc: `When your gig is done, it's time to request invoices and pay your talent. Use our Wrap/Pay system to gather invoices, receipts, send payments and create a report for your wrap book. Once the gig is paid, you can archive it for later reference.`,
  },
  {
    id: 4,
    title: 'Buddi Wallet',
    placement: 'bottomLeft',
    desc: `Click here to view your Buddi Wallet. You can also start your setup here to get paid faster. It's secure and easy.`,
  },
  {
    id: 5,
    title: 'Document',
    placement: 'bottomLeft',
    desc: `All of your talent invoices and W9's will automatically be uploaded here when you receive your final invoices from talent. No more chasing people for documentation, it's all right here.`,
  },
  {
    id: 6,
    title: 'Corporate Network',
    placement: 'bottomLeft',
    desc: `Add your favorite talent to this area so you can recommend people and stay connected on your next gig.`,
  },
  {
    id: 7,
    title: 'Create Band',
    placement: 'rightTop',
    desc: `Click here if you would like to invite a production band onto the platform for free. This will help you book talent for your gig.`,
  },
];
