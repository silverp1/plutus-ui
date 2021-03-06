import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigation from '../../components/navigation';
import { pushAlert, popAlert } from '../../features/alerts/actions';
import { getAccount } from '../../features/accounts/actions';
import { getIncome } from '../../features/income/actions';
import { getExpense, updateExpense } from '../../features/expenses/actions';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  InputGroup
} from 'reactstrap';
import Loading from '../../components/Loading';
import TransactionSearchModal from '../../components/TransactionSearchModal';
import { redirectTo } from '../../util/general';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';

class EditExpense extends Component {
  constructor(props) {
    super(props);

    let accountId = 0;
    let incomeId = 0;
    let expenseId = 0;

    if (!isNaN(parseInt(this.props.match.params.accountId))) {
      accountId = parseInt(this.props.match.params.accountId)
    }

    if (!isNaN(parseInt(this.props.match.params.incomeId))) {
      incomeId = parseInt(this.props.match.params.incomeId)
    }

    if (!isNaN(parseInt(this.props.match.params.expenseId))) {
      expenseId = parseInt(this.props.match.params.expenseId)
    }

    this.state = {
      accountId: accountId,
      incomeId: incomeId,
      expenseId: expenseId,
      transactionDescription: "",
      transactionAmount: 0.00,
      transactionSearchModalIsOpen: false,
      selectedTransactionDescription: "",
      selectedTransactionAmount: null,
      expenseDescription: ""
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.transactionSearchModalOnSubmit = this.transactionSearchModalOnSubmit.bind(this);
    this.transactionSearchModalDismiss = this.transactionSearchModalDismiss.bind(this);
    this.transactionSearchModalOpen = this.transactionSearchModalOpen.bind(this);
    this.transactionSearchModalRecord = this.transactionSearchModalRecord.bind(this);
    this.handleExpenseDescriptionChange = this.handleExpenseDescriptionChange.bind(this);

    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getAccount(
      this.state.accountId
    )
    await this.props.getIncome(
      this.state.accountId,
      this.state.incomeId
    )
    await this.props.getExpense(
      this.state.accountId,
      this.state.incomeId,
      this.state.expenseId
    )
    await this.setState({
      selectedTransactionDescription: this.props.expense.transaction_description,
      selectedTransactionAmount: this.props.expense.amount,
      expenseDescription: this.props.expense.description
    })
  }

  async onSubmit(e) {
    e.preventDefault();
    let description = e.target[0].value;
    let transactionDescription = e.target[1].value;
    let recurring = true
    let amount = e.target[3].value ? parseFloat(e.target[3].value) : e.target[3].value;
    let month = null;

    await this.props.updateExpense(
      this.state.accountId,
      this.state.incomeId,
      this.state.expenseId,
      amount,
      description,
      transactionDescription,
      recurring,
      month
    )
    redirectTo(`/accounts/${this.state.accountId}/income/${this.state.incomeId}`);
  }

  async transactionSearchModalOpen() {
    await this.setState({
      transactionSearchModalIsOpen: true
    });
  }

  transactionSearchModalOnSubmit() {
    console.log("I was clicked")
  }

  async transactionSearchModalDismiss() {
    await this.setState({
      transactionSearchModalIsOpen: false
    });
  }

  async transactionSearchModalRecord(description, amount) {
    await this.setState({
      selectedTransactionDescription: description,
      selectedTransactionAmount: amount,
      transactionSearchModalIsOpen: false,
    });
  }

  async handleDescriptionChange(e) {
    if (e.target) {
      await this.setState({
        selectedTransactionDescription: e.target.value
      })
    }
  }

  async handleAmountChange(e) {
    if (e.target) {
      await this.setState({
        selectedTransactionAmount: e.target.value
      })
    }
  }

  async handleExpenseDescriptionChange(e) {
    if (e.target) {
      await this.setState({
        expenseDescription: e.target.value
      })
    }
  }
  
  render() {
    return (
      <div>
        <Navigation />
        <Container>
          {this.props.isFetching
            ? <Loading />
            : (
              <div>
                <ReactTooltip />
                <Breadcrumb>
                  <BreadcrumbItem><a href="/accounts">Accounts</a></BreadcrumbItem>
                  <BreadcrumbItem><a href={`/accounts/${this.props.account.id}`}>{this.props.account.description}</a></BreadcrumbItem>
                  <BreadcrumbItem><a href={`/accounts/${this.props.account.id}/income/${this.props.income.id}`}>{this.props.income.description}</a></BreadcrumbItem>
                  <BreadcrumbItem active>Edit Expense</BreadcrumbItem>
                </Breadcrumb>
                <div>
                  <h2 className="plutus-subheader">Update Expense</h2>
                </div>
                <Card>
                  <CardBody>
                    <Form onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                          type="text"
                          name="description"
                          id="description"
                          value={this.state.expenseDescription}
                          onChange={this.handleExpenseDescriptionChange}
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="transactionDescription">Transaction Description</Label>
                        <InputGroup>
                        <Input
                          type="text"
                          name="transactionDescription"
                          id="transactionDescription"
                          value={this.state.selectedTransactionDescription}
                          onChange={this.handleDescriptionChange}
                          required
                        />
                        <Button onClick={this.transactionSearchModalOpen}>
                          <FontAwesomeIcon icon={faSearch} data-tip='Find transaction' />
                        </Button>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Input
                          type="number"
                          name="amount"
                          id="amount"
                          step="0.01"
                          value={this.state.selectedTransactionAmount}
                          onChange={this.handleAmountChange}
                          required
                        />
                      </FormGroup>
                      <Button className="btn btn-success" type="submit">Save</Button>
                    </Form>
                  </CardBody>
                </Card>
                <TransactionSearchModal
                  modalIsOpen={this.state.transactionSearchModalIsOpen}
                  modalDismiss={this.transactionSearchModalDismiss}
                  onSubmit={this.transactionSearchModalOnSubmit}
                  accountId={this.state.accountId}
                  sendTransaction={this.transactionSearchModalRecord}
                />
              </div>
            )
          }
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  linkToken: state.accountsReducer.linkToken,
  alerts: state.alertsReducer.alerts,
  isFetching: state.accountsReducer.isFetching
    || state.expensesReducer.isFetching
    || state.incomeReducer.isFetching,
  accounts: state.accountsReducer.accounts,
  account: state.accountsReducer.account,
  income: state.incomeReducer.income,
  expense: state.expensesReducer.expense
});

const mapActionsToProps = {
  popAlert,
  pushAlert,
  getAccount,
  getIncome,
  getExpense,
  updateExpense
}

export default connect(mapStateToProps, mapActionsToProps)(EditExpense);