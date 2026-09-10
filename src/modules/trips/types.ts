export type TripItem={id:string;placeId:string;startsAt:string;durationMinutes:number;source:string;state:string;previousState?:string};
export type TripDay={date:string;items:TripItem[]};
export type Visit={id:string;placeId:string;occurredAt:string;evidence:string;tripId:string;isReturn:boolean;outsidePlannedRoute?:boolean};
export type TripData={trip:{id:string;synthetic:boolean;cityId:string;startsOn:string;endsOn:string;party:string;pace:string;transport:string;interests:string[];intentions:string[];needs?:string[]};days:TripDay[];visits:Visit[];weather:Array<{date:string;condition:string;temperatureC:number;rainProbability:number;demo:boolean}>};
