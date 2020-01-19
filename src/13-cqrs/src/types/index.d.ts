type PageInfo = {
  cursor?: string;
  limit?: number;
};

type ResolverOptions = Record<string, any>;
type FindAllOptions = ResolverOptions;

type FindOneOptions = {
  id: number;
};
