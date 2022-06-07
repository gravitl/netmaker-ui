import { CompareArrows } from '@mui/icons-material'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Container,
} from '@mui/material'

export function Tablefilter() {
  return (
    <Container>
      <Grid container justifyContent="space-around" alignItems="center">
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Filter Nodes by:</InputLabel>
            <Select>
              <MenuItem value={10}>Address</MenuItem>
              <MenuItem value={20}>Node Name</MenuItem>
              <MenuItem value={30}>Network</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <CompareArrows />
        </Grid>
      </Grid>
    </Container>
  )
}
