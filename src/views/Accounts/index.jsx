import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigation from '../../components/navigation';
import { getLinkToken, createAccount, getAccounts } from '../../features/accounts/actions';
import { pushAlert, popAlert } from '../../features/alerts/actions';
import showAlert from '../../util/alerts';
import { formatAccountDescription } from '../../util/account';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Breadcrumb,
  BreadcrumbItem,
  Modal
} from 'reactstrap';
import { PlaidLink } from 'react-plaid-link';
import Loading from '../../components/Loading';
import AccountsTable from '../../components/AccountsTable'
import { redirectTo } from '../../util/general';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class Account extends Component {
  constructor(props) {
    super(props);

    this.modalOpen = this.modalOpen.bind(this);
    this.isModalOpen = this.isModalOpen.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.popAlert = this.popAlert.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.modalDismiss = this.modalDismiss.bind(this);

    this.state = {
      modalIsOpen: false,
      publicToken: "",
      description: "",
      remoteId: "",
      lastFour: 0,
      accountName: ""
    }
  }
  
  popAlert() {
    this.props.pushAlert(['success', 'ohboy']);
    showAlert(this.props.alerts);
    this.props.popAlert();
  }

  async componentDidMount() {
    await this.props.getLinkToken();
    await this.props.getAccounts();
    console.log(this.props.accounts);
    console.log(this.props.linkToken);
    showAlert(this.props.alerts);
    this.props.popAlert();
  }

  componentDidUpdate() {
    showAlert(this.props.alerts);
    this.props.popAlert();
  }

  async onSuccess(publicToken, metadata) {
    console.log(metadata);
    await this.setState({
      modalIsOpen: true,
      publicToken,
      remoteId: metadata.account.mask,
      lastFour: metadata.account_id,
      accountName: formatAccountDescription(metadata)
    });
  }

  async modalOpen() {
    await this.setState({
      modalIsOpen: !this.state.modalIsOpen
    });
  }

  isModalOpen() {
    console.log(this.state.modalIsOpen);
    return this.state.modalIsOpen;
  }

  handleDescriptionChange(e) {
    if(e.target && e.target.value) {
      this.setState({description: e.target.value})
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    await this.setState({
      modalIsOpen: false
    });
    await this.props.createAccount(
      this.state.publicToken,
      this.state.description,
      this.state.accountName,
      this.state.lastFour,
      this.state.remoteId
    )
    await this.setState({
      publicToken: "",
      description: ""
    });
    redirectTo('/accounts')
  }

  async modalDismiss() {
    await this.setState({
      description: "",
      modalIsOpen: false
    });
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
                <Breadcrumb>
                  <BreadcrumbItem active>Accounts</BreadcrumbItem>
                </Breadcrumb>
                <div>
                  <h2 className="plutus-subheader">Accounts</h2>
                </div>
                <AccountsTable
                  accounts={this.props.accounts} 
                />
                <PlaidLink
                  token={this.props.linkToken}
                  onSuccess={this.onSuccess}
                  env="development"
                >
                  Connect a new account
                </PlaidLink>
                <Modal
                  isOpen={this.state.modalIsOpen}
                >
                  <div style={{ padding: "1em" }}>
                    <div>
                      <div style={{ textAlign: "right"}}>
                        <FontAwesomeIcon icon={faTimes} color="grey" onClick={this.modalDismiss}/>
                      </div>
                      <h2>Add Account</h2>
                    </div>
                    <Form onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                          type="text"
                          name="description"
                          id="description"
                          value={this.state.description}
                          onChange={this.handleDescriptionChange}
                        />
                        <Button className="btn btn-success" type="submit">Add Account</Button>
                      </FormGroup>
                    </Form>
                  </div>
                </Modal>
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
  isFetching: state.accountsReducer.isFetching,
  accounts: state.accountsReducer.accounts,
});

const mapActionsToProps = {
  getLinkToken,
  createAccount,
  getAccounts,
  popAlert,
  pushAlert
}

export default connect(mapStateToProps, mapActionsToProps)(Account);
