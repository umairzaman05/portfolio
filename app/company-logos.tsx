import Image from 'next/image';

const companies = [
  { name:'The Binary Holdings', detail:'Product management → AI delivery', file:null, href:'https://www.thebinaryholdings.com/' },
  { name:'The Binary Labs', detail:'AI division of The Binary Holdings', file:'binary-labs.svg', href:'https://www.thebinarylabs.ai/' },
  { name:'Lulu Group International', detail:'Product analytics', file:'lulu-group.png', href:'https://www.lulugroupinternational.com/' },
];

export function CompanyLogos() {
  return <div className="company-logos" aria-label="Companies in my career">{companies.map(company=><a key={company.name} href={company.href} target="_blank" rel="noreferrer"><span className={`company-logo-image ${company.file?'':'holdings-brand'}`}>{company.file?<Image unoptimized src={`/companies/${company.file}`} alt={`${company.name} logo`} width={176} height={62}/>:<span className="holdings-native-mark" aria-hidden="true"/>}</span><strong>{company.name}</strong><span>{company.detail}</span></a>)}</div>;
}
