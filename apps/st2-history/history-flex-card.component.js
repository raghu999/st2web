import React from 'react';
import { PropTypes } from 'prop-types';

import cx from 'classnames';
import isExpandable from '@stackstorm/module-filter-expandable';
import proportional from '@stackstorm/module-proportional';
const makeProportional = proportional();

import Label from '@stackstorm/module-label';
import Time from '@stackstorm/module-time';

export default class HistoryFlexCard extends React.Component {
  static propTypes = {
    isChild: PropTypes.bool.isRequired,
    execution: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    view: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onToggleExpand: PropTypes.func,
  }

  static defaultProps = {
    isChild: false,
  }

  static contextTypes = {
    scrollIntoView: PropTypes.func.isRequired,
  }

  handleToggleExpand(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    this.props.onToggleExpand();
  }

  render() {
    const { isChild, execution, selected, view, onClick } = this.props;

    return (
      <div
        className={cx({
          'st2-flex-card': true,
          'st2-flex-card--active': selected,
        })}
        onClick={onClick}
        data-test={`execution execution:${execution.id}`}
        ref={selected ? this.context.scrollIntoView : null}
      >
        <div className="st2-flex-card__row">
          <div className="st2-flex-card__column st2-flex-card__expand">
            { isExpandable(execution) ? (
              <i
                className={cx({
                  'icon-chevron-down': execution.fetchedChildren,
                  'icon-chevron_right': !execution.fetchedChildren,
                })}
                onClick={(e) => this.handleToggleExpand(e)}
              />
            ) : null }
          </div>

          <div className="st2-flex-card__column st2-flex-card__status">
            { view.meta && view.meta.status ? (
              <Label status={execution.status} short={true} />
            ) : null }
          </div>

          <div className="st2-flex-card__column st2-flex-card__timestamp">
            { view.meta && view.meta.time ? (
              <div className="st2-flex-card__header-primary">
                <Time timestamp={execution.start_timestamp} format="HH:mm:ss" />
              </div>
            ) : null }
          </div>

          { isChild ? (
            <div className="st2-flex-card__column">
              { execution.context.chain ? execution.context.chain.name : null }
              { execution.context.mistral ? execution.context.mistral.task_name : null }
            </div>
          ) : null }

          { view.action ? (
            <div className="st2-flex-card__column" title={execution.action.ref}>
              <span className="st2-history__column-action-name">
                { execution.action.ref }
              </span>
              { view.action.params ? (
                <span className="st2-history__column-action-params" ref={makeProportional}>
                  { Object.keys(execution.parameters || {}).map((name) => {
                    const value = execution.parameters[name];
                    return (
                      <span key={name} className="st2-history__column-action-param">
                        <span className="st2-history__column-action-param-name">
                          { name }=
                        </span>
                        <span className="st2-history__column-action-param-value">
                          { JSON.stringify(value) }
                        </span>
                      </span>
                    );
                  }) }
                </span>
              ) : null }
            </div>
          ) : null }

          { isChild ? null : (
            view.trigger ? (
              <div className="st2-flex-card__column">
                { execution.rule && execution.trigger ? (
                  <span title={`${execution.rule.ref} (${execution.trigger.type})`}>
                    <span className="st2-history__column-rule-name">
                      { execution.rule.ref }
                    </span>
                    <span className="st2-history__column-trigger-type">
                      { execution.trigger.type }
                    </span>
                  </span>
                ) : (
                  <span title={`Manual (${execution.context.user})`}>
                    <span className="st2-history__column-app-name">
                      Manual
                    </span>
                    <span className="st2-history__column-user-name">
                      { execution.context.user }
                    </span>
                  </span>
                ) }
              </div>
            ) : null
          ) }

          <div className="st2-flex-card__column st2-flex-card__status">
            { isExpandable(execution) && view.meta && view.meta.type ? (
              <i className="icon-branch" onClick={(e) => this.handleToggleExpand(e)} />
            ) : null }
          </div>
        </div>
      </div>
    );
  }
}
