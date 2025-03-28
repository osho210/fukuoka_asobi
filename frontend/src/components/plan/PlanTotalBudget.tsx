'use client';

interface PlanTotalBudgetProps {
  totalBudget?: number;
}

const PlanTotalBudget: React.FC<PlanTotalBudgetProps> = ({ totalBudget }) => {
  if (!totalBudget) return null;

  return (
    <div className="plan-total-section">
      <h3 className="plan-total-title">合計予算</h3>
      <div className="plan-total-budget">
        <span>¥</span>
        <span className="plan-total-budget-value">{totalBudget.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PlanTotalBudget;
