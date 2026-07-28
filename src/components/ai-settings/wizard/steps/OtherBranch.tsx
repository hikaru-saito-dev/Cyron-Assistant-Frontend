import type { OtherData } from "../categoryTypes";
import { PartnershipBlock } from "../shared/PartnershipBlock";
import { PaymentsBlock } from "../shared/PaymentsBlock";
import { ProblemSolutionList } from "../shared/ProblemSolutionList";
import { ChipMulti, SectionCard } from "./categoryUi";

type Role = { id: string; name: string };

type Props = {
  data: OtherData;
  roles: Role[];
  onChange: (data: OtherData) => void;
};

const ROUTING = [
  "Ask questions",
  "Request something",
  "Report a problem",
  "Purchases/payments",
];

export function OtherBranch({ data, roles, onChange }: Props) {
  return (
    <div className="space-y-5">
      <SectionCard title="O2 — What do users open tickets for?">
        <ChipMulti
          options={ROUTING}
          values={data.routing}
          onChange={(routing) => onChange({ ...data, routing })}
        />
      </SectionCard>

      <SectionCard title="O3 — Problems → Solutions" required>
        <ProblemSolutionList
          rows={data.problems}
          onChange={(problems) => onChange({ ...data, problems })}
          max={5}
          minRequired={2}
        />
      </SectionCard>

      {data.routing.includes("Purchases/payments") && (
        <SectionCard title="O4 — Payments" required>
          <PaymentsBlock
            data={data.payments}
            onChange={(payments) => onChange({ ...data, payments })}
          />
        </SectionCard>
      )}

      <PartnershipBlock
        data={data.partnership}
        roles={roles}
        categoryPlaceholder="describe your partnership criteria"
        onChange={(partnership) => onChange({ ...data, partnership })}
      />

      <SectionCard title="O6 — Bot autonomy">
        <ChipMulti
          options={[
            { id: "faq", label: "FAQ" },
            { id: "collect_info", label: "Collect info before staff" },
            { id: "nothing_else", label: "Nothing else" },
          ]}
          values={data.autonomy}
          onChange={(autonomy) => onChange({ ...data, autonomy })}
        />
      </SectionCard>
    </div>
  );
}
