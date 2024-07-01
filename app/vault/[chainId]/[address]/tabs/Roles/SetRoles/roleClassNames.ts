const uncheckedClassName = `text-neutral-500 border-neutral-800`

export const roleClassNames = {
  'ROLE_MANAGER': {
    defaults: `
      hover:bg-green-500/10 hover:border-green-500 hover:text-green-400
      active:border-green-300 active:text-green-200`,
    checked: `border-green-700 text-green-500`,
    unchecked: uncheckedClassName,
    dot: `bg-green-300`,
  },
  'ADD_STRATEGY_MANAGER': {
    defaults: `
      hover:bg-green-500/10 hover:border-green-500 hover:text-green-400
      active:border-green-300 active:text-green-200`,
    checked: `border-green-700 text-green-500`,
    unchecked: uncheckedClassName,
    dot: `bg-green-300`,
  },
  'REVOKE_STRATEGY_MANAGER': {
    defaults: `
      hover:bg-red-500/10 hover:border-red-500 hover:text-red-400
      active:border-red-300 active:text-red-200`,
    checked: `border-red-700 text-red-500`,
    unchecked: uncheckedClassName,
    dot: `bg-red-300`,
  },
  'FORCE_REVOKE_MANAGER': {
    defaults: `
      hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-400
      active:border-orange-300 active:text-orange-200`,
    checked: `border-orange-700 text-orange-500`,
    unchecked: uncheckedClassName,
    dot: `bg-orange-300`,
  },
  'ACCOUNTANT_MANAGER': {
    defaults: `
      hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-400
      active:border-blue-300 active:text-blue-200`,
    checked: `border-blue-700 text-blue-500`,
    unchecked: uncheckedClassName,
    dot: `bg-blue-300`,
  },
  'QUEUE_MANAGER': {
    defaults: `
      hover:bg-yellow-500/10 hover:border-yellow-500 hover:text-yellow-400
      active:border-yellow-300 active:text-yellow-200`,
    checked: `border-yellow-700 text-yellow-500`,
    unchecked: uncheckedClassName,
    dot: `bg-yellow-300`,
  },
  'REPORTING_MANAGER': {
    defaults: `
      hover:bg-purple-500/10 hover:border-purple-500 hover:text-purple-400
      active:border-purple-300 active:text-purple-200`,
    checked: `border-purple-700 text-purple-500`,
    unchecked: uncheckedClassName,
    dot: `bg-purple-300`,
  },
  'DEBT_MANAGER': {
    defaults: `
      hover:bg-teal-500/10 hover:border-teal-500 hover:text-teal-400
      active:border-teal-300 active:text-teal-200`,
    checked: `border-teal-700 text-teal-500`,
    unchecked: uncheckedClassName,
    dot: `bg-teal-300`,
  },
  'MAX_DEBT_MANAGER': {
    defaults: `
      hover:bg-indigo-500/10 hover:border-indigo-500 hover:text-indigo-400
      active:border-indigo-300 active:text-indigo-200`,
    checked: `border-indigo-700 text-indigo-500`,
    unchecked: uncheckedClassName,
    dot: `bg-indigo-300`,
  },
  'DEPOSIT_LIMIT_MANAGER': {
    defaults: `
      hover:bg-pink-500/10 hover:border-pink-500 hover:text-pink-400
      active:border-pink-300 active:text-pink-200`,
    checked: `border-pink-700 text-pink-500`,
    unchecked: uncheckedClassName,
    dot: `bg-pink-300`,
  },
  'WITHDRAW_LIMIT_MANAGER': {
    defaults: `
      hover:bg-lime-500/10 hover:border-lime-500 hover:text-lime-400
      active:border-lime-300 active:text-lime-200`,
    checked: `border-lime-700 text-lime-500`,
    unchecked: uncheckedClassName,
    dot: `bg-lime-300`,
  },
  'MINIMUM_IDLE_MANAGER': {
    defaults: `
      hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400
      active:border-cyan-300 active:text-cyan-200`,
    checked: `border-cyan-700 text-cyan-500`,
    unchecked: uncheckedClassName,
    dot: `bg-cyan-300`,
  },
  'PROFIT_UNLOCK_MANAGER': {
    defaults: `
      hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-400
      active:border-rose-300 active:text-rose-200`,
    checked: `border-rose-700 text-rose-500`,
    unchecked: uncheckedClassName,
    dot: `bg-rose-300`,
  },
  'DEBT_PURCHASER': {
    defaults: `
      hover:bg-amber-500/10 hover:border-amber-500 hover:text-amber-400
      active:border-amber-300 active:text-amber-200`,
    checked: `border-amber-700 text-amber-500`,
    unchecked: uncheckedClassName,
    dot: `bg-amber-300`,
  },
  'EMERGENCY_MANAGER': {
    defaults: `
      hover:bg-fuchsia-500/10 hover:border-fuchsia-500 hover:text-fuchsia-400
      active:border-fuchsia-300 active:text-fuchsia-200`,
    checked: `border-fuchsia-700 text-fuchsia-500`,
    unchecked: uncheckedClassName,
    dot: `bg-fuchsia-300`,
  },
}
