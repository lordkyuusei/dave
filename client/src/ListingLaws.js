import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button'

let counter = 0;
function createData(title, desc, sender, begin, end) {
  counter += 1;
  return { id: counter, title, desc, sender, begin, end };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'title', numeric: false, disablePadding: true, label: 'Titre de loi' },
  { id: 'sender', numeric: false, disablePadding: false, label: 'Emetteur' },
  { id: 'begin', numeric: false, disablePadding: false, label: 'Début' },
  { id: 'end', numeric: true, disablePadding: false, label: 'Fin' },
  { id: 'vote', numeric: true, disablePadding: false, label: 'Démarrer' },
];

// Table header
class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            ⚖
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

// Styles
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

// Toolbar
let EnhancedTableToolbar = props => {
  const { numSelected, classes, open, handleNewLawOpen, handleNewLawClose } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
              Textes de loi ⚖⚖⚖
          </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Button onClick={handleNewLawOpen} color="primary">
          🌱
        </Button>
        <Dialog
          open={open}
          onClose={handleNewLawClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewLawClose} color="secondary" variant="contained">
              Annuler
            </Button>
            <Button onClick={handleNewLawClose} color="primary" variant="contained">
              Soumettre
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const descr = "Description très longue et inutilement ennuyante dans le seul but de donner un peu de consistence à ce dialog, en espérant que vous passiez un bon moment, sinon il fait super beau c'est dommage que les Gilets Jaunes soi...";

class EnhancedTable extends React.Component {
  state = {
    open: false,
    open2: false,
    order: 'asc',
    orderBy: 'title',
    selected: [],
    data: [
      createData('Loi IVG', descr, "Dominique", 67, 4.3),
      createData('Loi CICE', descr, "Valérie", 51, 4.9),
      createData('Loi CaC40', descr, "Jean François", 24, 6.0),
      createData('Loi anti soda', descr, "Ce sont bien sûr", 24, 4.0),
      createData('Loi anti japs', descr, "de faux noms", 49, 3.9),
      createData('Loi anti caisse epargne', descr, "parce qu'en vrai", 87, 6.5),
      createData('Loi sans inspiration', descr, "ça doit être des adresses", 37, 4.3),
      createData('Loi au chocolat', descr, "mais bon", 94, 0.0),
      createData('Loi Seau', descr, "entre nous", 65, 7.0),
      createData('Loi marchal', descr, "qui ça intéresse", 98, 0.0),
      createData('Loi marchienl', descr, "pas moi en tout cas", 81, 2.0),
      createData('Loi ioL', descr, "trump sous côté", 9, 37.0),
      createData('Loi quelconque', descr, "18", 63, 4.0),
    ],
    page: 0,
    rowsPerPage: 10,
  };

  handleNewLawOpen = () => {
    this.setState({ open2: true })
  }

  handleNewLawClose = () => {
    this.setState({ open2: false })
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, open2, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} open={open2} handleNewLawOpen={this.handleNewLawOpen} handleNewLawClose={this.handleNewLawClose}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              handleNewLawOpen={this.handleNewLawOpen}
              open={open2}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        {n.id}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.title}
                      </TableCell>
                      <TableCell>{n.sender}</TableCell>
                      <TableCell>{n.begin}</TableCell>
                      <TableCell align="right">{n.end}</TableCell>
                      <TableCell align="right">
                        <Button onClick={this.handleClickOpen} color="primary">Voter</Button>
                      </TableCell>
                      <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="draggable-dialog-title"
                      >
                        <DialogTitle id="draggable-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            {n.desc}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={this.handleClose} color="secondary" variant="contained">
                            Refuser
                          </Button>
                          <Button onClick={this.handleClose} color="primary" variant="contained">
                            Approuver
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);