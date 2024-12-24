export interface CountriesType {
    status:string,
    data:{
        count:number,
        next:null | string,
        previous:null | string,
        results:{
            id:number,
            name:string,
        }[],
    }
}

export interface RegionType {
    status:string,
    data:{
        count:number,
        next:null | string,
        previous:null | string,
        results:{
            id:number,
            name:string,
            country:{
                id:number,
                name:string,
            }
        }[]
    }
}

export interface SubRegionType {
    status:string,
    data:{
        count:number,
        next:null | string,
        previous:null | string,
        results:{
            id:number,
            name:string,
            region:{
                id:number,
                name:string,
                country:{
                    id:number,
                    name:string,
                }
            }
        }[]
    }
}

export interface CreateAddressResultType {
    status: string;
  data: {
    id: string;
    title: string;
    country: {
      id: number;
      name: string;
    };
    region: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
    full_address: string;
    phone_number: string;
    subregion: {
      id: number;
      name: string;
      region: {
        id: number;
        name: string;
        country: {
          id: number;
          name: string;
        };
      };
    };
    first_name: string;
    last_name: string;
  };
}

export interface AllAddressType{
    status: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
      id: string;
      title: string;
      country: {
        id: number;
        name: string;
      };
      region: {
        id: number;
        name: string;
        country: {
          id: number;
          name: string;
        };
      };
      full_address: string;
      phone_number: string;
      subregion: {
        id: number;
        name: string;
        region: {
          id: number;
          name: string;
          country: {
            id: number;
            name: string;
          };
        };
      };
      first_name: string;
      last_name: string;
    }[];
  };
}

export interface AddressPayloadType{
  title:string,
  first_name:string,
  last_name:string,
  full_address:string,
  country_id:number,
  region_id:number,
  subregion_id:number,
  phone_number:string,
}
