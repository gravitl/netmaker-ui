import React, { useContext } from 'react'
import { Breadcrumbs } from '@mui/material'

import Typography from '@mui/material/Typography'
import Link, { LinkProps } from '@mui/material/Link'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { Modify } from '../types/react-app-env'

interface Crumb {
  title: string
  link: string
  prefix?: string
}

type BreadcrumbContextType = {
  add: (crumb: Crumb) => () => void
  crumbs: Array<Crumb>
}

const BreadcrumbContext = React.createContext<BreadcrumbContextType>({
  add: () => () => {},
  crumbs: [],
})

const LinkRouter: React.FC<Omit<LinkProps<RouterLink>, 'component'>> = (
  props
) => <Link {...props} component={RouterLink} />

export const PathBreadcrumbsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [crumbs, setCrumbs] = React.useState<Array<Crumb>>([])

  const add = React.useCallback(
    (crumb: Crumb) => {
      setCrumbs((value) =>
        [...value, crumb].sort((a, b) =>
          a.link.length > b.link.length ? 1 : -1
        )
      )
      return () => {
        setCrumbs((value) => [...value.filter((c) => c.link !== crumb.link)])
      }
    },
    [setCrumbs]
  )

  return (
    <BreadcrumbContext.Provider
      value={{
        add,
        crumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const PathBreadcrumbs: React.FC<Crumb> = ({ title, link }) => {
  const { crumbs } = useContext(BreadcrumbContext)

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to={link}>
        {title}
      </LinkRouter>
      {crumbs.reduce<JSX.Element[]>((acc, value, index) => {
        if (index === crumbs.length - 1) {
          if (value.prefix !== undefined) {
            acc.push(
              <Typography color="text.primary" key={value.link + value.prefix}>
                {value.prefix}
              </Typography>
            )
          }
          acc.push(
            <Typography color="text.primary" key={value.link}>
              {value.title}
            </Typography>
          )
        } else {
          if (value.prefix !== undefined) {
            acc.push(
              <LinkRouter
                underline="hover"
                color="inherit"
                to={value.link}
                key={value.link + value.prefix}
              >
                {value.prefix}
              </LinkRouter>
            )
          }
          acc.push(
            <LinkRouter
              underline="hover"
              color="inherit"
              to={value.link}
              key={value.link}
            >
              {value.title}
            </LinkRouter>
          )
        }
        return acc
      }, [])}
    </Breadcrumbs>
  )
}

export const useLinkBreadcrumb = (crumb: Modify<Crumb, { link?: string }>) => {
  const { add } = useContext(BreadcrumbContext)
  const { url } = useRouteMatch()

  const areCrumbsEqual = (
    a: Modify<Crumb, { link?: string }> | undefined,
    b: Modify<Crumb, { link?: string }>
  ) => {
    if (!a || !b) return JSON.stringify(a) === JSON.stringify(b)
    return a.link === b.link && a.title === b.title && a.prefix === b.prefix
  }
  const previousCrumb = usePrevious({ ...crumb })

  React.useEffect(() => {
    const areEqual = areCrumbsEqual(previousCrumb, crumb)
    if (!areEqual) {
      return add({ link: url, ...crumb })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const usePrevious = (value: Modify<Crumb, { link?: string }>) => {
  const ref = React.useRef<Modify<Crumb, { link?: string }>>()
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}
