interface Transaction {
    invoiceId: string;
    cashbackDate: string;
    type: 'Credit' | 'Debit';
    cashbackAmount: number;
    loanId: string;
    repayAmount: number;
}

const RewardTransactionItem: React.FC<{ item: Transaction, index: number, totalItems: number }> = ({ item, index, totalItems }) => {

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    return (
        <div key={index}>
            <div className="py-2.5">
                <div className="flex">
                    <div className="w-1/2">
                        <div className="text-[12px] text-[#a1a1a1]">
                            Purchase Order No.
                        </div>
                        <div className="text-[12px] text-[#7e67da]">
                            {item.invoiceId}
                        </div>
                    </div>
                    <div className="w-1/2 text-right">
                        <div className="text-[12px] text-[#a1a1a1]">
                            {formatDate(item.cashbackDate)}
                        </div>
                        <div className={`text-[12px] ${item.type === 'Credit' ? 'text-[#97c93e]' : 'text-[#ff5252]'}`}>
                            {item.type === 'Credit' ? '+' : '-'} ₹ {item.cashbackAmount.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="flex mt-3">
                    <div className="w-1/2">
                        <div className="text-[12px] text-[#a1a1a1]">Loan#</div>
                        <div className="text-[12px] text-[#666666]">
                            {item.loanId}
                        </div>
                    </div>
                    <div className="w-1/2 text-right">
                        <div className="text-[12px] text-[#a1a1a1]">
                            Repayment Amt.
                        </div>
                        <div className="text-[12px] text-[#666666]">
                            ₹ {item.repayAmount.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
            {index < totalItems - 1 && index < 2 && (
                <hr className="border-t border-[#d1c4e9] my-2" />
            )}
        </div>
    );
};

export default RewardTransactionItem;