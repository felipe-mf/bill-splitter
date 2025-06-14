interface SummarySectionProps {
  totals: number[];
  totalSum: number | null;
}

const SummarySection = ({ totals, totalSum }: SummarySectionProps) => {
  const perPerson = totalSum !== null ? totalSum / 2 : null;

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-4">Resumo</h2>
      {totals.length === 0 ? (
        <p>Nenhum valor carregado ainda.</p>
      ) : (
        <>
          <ul className="list-disc pl-6 mb-4">
            {totals.map((val, idx) => (
              <li key={idx}>Conta {idx + 1}: R$ {val.toFixed(2)}</li>
            ))}
          </ul>
          <p><strong>Total:</strong> R$ {totalSum?.toFixed(2)}</p>
          <p><strong>Por pessoa:</strong> R$ {perPerson?.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default SummarySection;
