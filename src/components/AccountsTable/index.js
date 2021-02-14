import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table
} from 'reactstrap';

class AccountsTable extends Component {
  render() {
    let accounts = this.props.accounts || []
    return (
      <Table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Current Balance</th>
            <th>Computed Balance</th>
          </tr>
        </thead>
        <tbody>
        {accounts.map((value, index) => {
          return (
            <tr key={index}>
              <td><a href={`/accounts/${value.id}`}>{value.description}</a></td>
              <td>{value.balance}</td>
              <td>{value.computed_balance}</td>
            </tr>
          )
        })}
        </tbody>
      </Table>
    )
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(AccountsTable);