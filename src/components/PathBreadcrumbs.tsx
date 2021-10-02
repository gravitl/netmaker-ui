import React, { useContext } from "react";
import { Breadcrumbs } from "@mui/material";

import Typography from "@mui/material/Typography";
import Link, { LinkProps } from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

interface Crumb {
  title: string;
  link: string;
}

type BreadcrumbContextType = {
  add: (crumb: Crumb) => () => void;
  crumbs: Array<Crumb>;
};

const BreadcrumbContext = React.createContext<BreadcrumbContextType>({
  add: () => () => {},
  crumbs: [],
});

const LinkRouter: React.FC<Omit<LinkProps<RouterLink>, "component">> = (
  props
) => <Link {...props} component={RouterLink} />;

export const PathBreadcrumbsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [crumbs, setCrumbs] = React.useState<Array<Crumb>>([]);

  const add = React.useCallback(
    (crumb: Crumb) => {
      setCrumbs((value) => [...value, crumb]);
      return () => {
        setCrumbs((value) => [...value.filter((c) => c.link !== crumb.link)]);
      };
    },
    [setCrumbs]
  );

  return (
    <BreadcrumbContext.Provider
      value={{
        add,
        crumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const PathBreadcrumbs: React.FC<Crumb> = ({ title, link }) => {
  const { crumbs } = useContext(BreadcrumbContext);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to={link}>
        {title}
      </LinkRouter>
      {crumbs.map((value, index) => {
        return index === crumbs.length - 1 ? (
          <Typography color="text.primary" key={value.link}>
            {value.title}
          </Typography>
        ) : (
          <LinkRouter
            underline="hover"
            color="inherit"
            to={value.link}
            key={value.link}
          >
            {value.title}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export const useLinkBreadcrumb = (crumb: Crumb) => {
  const { add } = useContext(BreadcrumbContext);
  React.useEffect(() => {
    return add(crumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
