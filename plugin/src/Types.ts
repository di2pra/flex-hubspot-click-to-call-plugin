export type ITableDataState = {
  limit: number,
  after: number,
  query: string
}

export type ICustomer = {
  createdate: string;
  email: string;
  firstname: string;
  lastname: string;
  hs_object_id: string;
  hubspot_owner_id: string;
  hs_calculated_phone_number: string;
}

export type IHubspotResponse = {
  total: number;
  results: {
    id: string;
    properties: ICustomer
  }[]
}

