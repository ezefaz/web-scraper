import BusinessSettingsForm from "@/components/business/BusinessSettingsForm";
import { getSeller } from "@/lib/actions";

type Props = {};

const BusinessSettings = async (props: Props) => {
  const foundSeller = await getSeller();

  console.log(foundSeller);
  return (
    <div>
      <BusinessSettingsForm sellerData={foundSeller} />
    </div>
  );
};

export default BusinessSettings;
