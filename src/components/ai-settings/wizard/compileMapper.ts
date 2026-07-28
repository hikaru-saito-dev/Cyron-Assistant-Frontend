import type { WizardAnswers, WizardCategory } from "./types";
import { newRuleId } from "./types";
import {
  emptyCommunity,
  emptyOther,
  emptyPartnership,
  emptySaas,
  emptySelling,
  type LinkableChannel,
  type ProblemSolutionRow,
} from "./categoryTypes";
import {
  formatPaymentsForCompile,
  paymentsHasDetails,
} from "./shared/PaymentsBlock";

function roleNames(
  ids: string[],
  roleNameById?: Record<string, string>,
): string {
  return ids.map((id) => roleNameById?.[id] || id).filter(Boolean).join(", ");
}

function formatRefundIssue(ids: string[]): string {
  const map: Record<string, string> = {
    same_method: "same payment method",
    server_credit: "server credit",
    replacement: "replacement",
  };
  return ids.map((i) => map[i] || i).join(", ") || "as configured";
}

function psRows(rows: ProblemSolutionRow[]) {
  return rows
    .filter((r) => r.problem.trim() && r.solution.trim())
    .map((r) => ({ problem: r.problem.trim(), solution: r.solution.trim() }));
}

function partnershipProblems(
  p: WizardAnswers["selling"]["partnership"],
  roleNameById?: Record<string, string>,
): { problem: string; solution: string }[] {
  if (!p.enabled) {
    return [
      {
        problem: "User asks about partnership / collaboration",
        solution:
          "Politely say this server doesn't handle partnerships via tickets.",
      },
    ];
  }
  const provide = p.provide.length
    ? p.provide.join(", ")
    : "link, description";
  const who = roleNames(p.evaluatorRoleIds, roleNameById) || "staff";
  return [
    {
      problem: "User proposes a partnership",
      solution: `State minimum requirements (${p.requirements || "as configured"}). Collect: ${provide}. Pass to ${who}. Never accept/reject or judge the proposal.`,
    },
  ];
}

export function buildCategoryCompileExtras(
  answers: WizardAnswers,
  roleNameById?: Record<string, string>,
): {
  general_info_extra: string;
  payment_info: string;
  problem_solutions: { problem: string; solution: string }[];
  knowledge_sources: string[];
  instructions_extra: string[];
} {
  const cat = answers.category ?? "other";
  const instructions_extra: string[] = [];
  const knowledge_sources: string[] = [];
  let general_info_extra = "";
  let payment_info = "";
  let problem_solutions: { problem: string; solution: string }[] = [
    ...answers.extractedProblems.map((p) => ({
      problem: p.problem,
      solution: p.solution,
    })),
  ];

  if (cat === "selling") {
    const s = answers.selling;
    general_info_extra = [
      s.products.length ? `Products sold: ${s.products.join(", ")}` : "",
      s.delivery
        ? `Delivery: ${s.delivery}${
            s.delivery !== "automatic" ? ` (max ${s.deliveryMaxTime})` : ""
          }`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    payment_info = formatPaymentsForCompile(s.payments);
    if (payment_info) {
      instructions_extra.push(
        "State ONLY the configured payment data, exactly as written. Do not accept methods not on the list, never modify addresses or emails, always specify the network for crypto addresses.",
      );
    }

    if (s.delivery === "manual" || s.delivery === "depends") {
      problem_solutions.push({
        problem: "Customer paid but received nothing",
        solution: `Reassure with maximum delivery time of ${s.deliveryMaxTime}. Collect order/payment details; escalate if overdue.`,
      });
    } else if (s.delivery === "automatic") {
      problem_solutions.push({
        problem: "Customer paid but received nothing",
        solution:
          "Confirm payment details, check automatic delivery status, escalate to staff if not delivered.",
      });
    }

    // Refund
    instructions_extra.push("Never confirm a refund: staff decides.");
    let refundSol = "";
    if (s.refundPolicy === "none") {
      refundSol = `No refunds${s.refundExceptions ? ` (exceptions: ${s.refundExceptions})` : ""}. Escalate edge cases to staff.`;
    } else if (s.refundPolicy === "broken") {
      refundSol = `Refund only if product doesn't work within ${s.refundWithin}. Customer must provide: ${s.refundProof.join(", ") || "proof"}. Issued via: ${formatRefundIssue(s.refundIssue)}. Never confirm — staff decides.`;
    } else if (s.refundPolicy === "within_n") {
      refundSol = `Refund within ${s.refundDays} days under: ${s.refundConditions || "stated conditions"}. Issued via: ${formatRefundIssue(s.refundIssue)}. Never confirm — staff decides.`;
    } else {
      refundSol = `Case-by-case: ${s.refundCaseExplain || "staff evaluates"}. Issued via: ${formatRefundIssue(s.refundIssue)}. Never confirm — staff decides.`;
    }
    problem_solutions.push({
      problem: "Customer asks for a refund",
      solution: refundSol,
    });

    if (s.warrantyEnabled) {
      problem_solutions.push({
        problem: "Customer asks about warranty / replacement",
        solution: `Coverage: ${s.warrantyCovers.join(", ") || "as configured"} for ${s.warrantyDuration}. Customer provides: ${s.warrantyProvide.join(", ")}. Exclusions: ${s.warrantyExclusions || "none stated"}. Perform preliminary check then escalate if needed.`,
      });
    } else {
      problem_solutions.push({
        problem: "Customer asks about warranty / replacement",
        solution: s.warrantyNoLine || "No warranty replacements offered.",
      });
    }

    if (s.pricesMode === "link") {
      const target =
        s.pricesChannelId
          ? `<#${s.pricesChannelId}>`
          : s.pricesUrl || "the price list";
      instructions_extra.push(
        `When asked about prices, link ${target}. Never invent figures.`,
      );
      if (s.pricesUrl) knowledge_sources.push(s.pricesUrl);
      if (s.pricesChannelName)
        knowledge_sources.push(`#${s.pricesChannelName}`);
    } else {
      instructions_extra.push(
        "Do not state prices — defer to staff or the official price list.",
      );
    }

    problem_solutions.push(...psRows(s.problems));
    problem_solutions.push(
      ...partnershipProblems(s.partnership, roleNameById),
    );

    const autonomyLabels: Record<string, string> = {
      explain_purchasing: "explain purchasing and payments",
      reassure_delivery: "reassure on delivery times",
      state_refund: "state the refund policy",
      confirm_warranty: "confirm warranty coverage",
      nothing_else: "nothing else",
    };
    const auto = s.autonomy
      .map((a) => autonomyLabels[a] || a)
      .filter((a) => a !== "nothing else");
    instructions_extra.push(
      `You can handle autonomously: ${auto.join(", ") || "none"}. For everything else: collect info and pass to staff.`,
    );
  }

  if (cat === "saas") {
    const s = answers.saas;
    general_info_extra = [
      s.productType ? `Product type: ${s.productType}` : "",
      s.pricingModel ? `Pricing: ${s.pricingModel}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (s.pricingModel === "free") {
      instructions_extra.push(
        "The product is free: clarify that no paid plans exist.",
      );
    }

    for (const r of s.resources) {
      if (r.url.trim())
        knowledge_sources.push(`${r.label || "Resource"}: ${r.url}`);
    }

    problem_solutions.push({
      problem: "User reports a bug / it doesn't work",
      solution: `Collect before escalating: ${s.bugTriage.join(", ") || "steps, screenshot, error"}. Never promise fix timelines.`,
    });
    instructions_extra.push("Never promise fix timelines.");

    problem_solutions.push(...psRows(s.problems));
    instructions_extra.push(
      "Try the known solution first; if it doesn't resolve, proceed as a bug report.",
    );

    if (s.pricingModel !== "free") {
      if (s.billingMode === "staff_only") {
        problem_solutions.push({
          problem: "Billing / subscription question",
          solution: "Always collect details and pass to staff.",
        });
      } else {
        problem_solutions.push({
          problem: "Billing / subscription question",
          solution: `Guide on simple cases${s.billingLink ? ` using ${s.billingLink}` : ""}; escalate complex cases.`,
        });
      }
      instructions_extra.push(
        "Never modify/promise plans, refunds or extensions.",
      );
    }

    if (s.featureRequests === "channel" && s.featureChannelId) {
      problem_solutions.push({
        problem: "Feature request",
        solution: `Direct user to <#${s.featureChannelId}>. Never promise development.`,
      });
    } else if (s.featureRequests === "ticket") {
      problem_solutions.push({
        problem: "Feature request",
        solution:
          "Collect the request in the ticket and pass to staff. Never promise development.",
      });
    } else {
      problem_solutions.push({
        problem: "Feature request",
        solution: "Politely say feature requests are not accepted.",
      });
    }
    instructions_extra.push(
      "Never promise that a feature will be developed.",
    );

    problem_solutions.push(
      ...partnershipProblems(s.partnership, roleNameById),
    );

    const autonomyLabels: Record<string, string> = {
      answer_docs: "answer with the docs",
      known_solutions: "apply known solutions",
      bug_triage: "bug triage",
      simple_billing: "simple billing",
      nothing_else: "nothing else",
    };
    const auto = s.autonomy
      .map((a) => autonomyLabels[a] || a)
      .filter((a) => a !== "nothing else");
    instructions_extra.push(
      `You can handle autonomously: ${auto.join(", ") || "none"}. For everything else: collect info and pass to staff.`,
    );
  }

  if (cat === "community") {
    const c = answers.community;
    general_info_extra = c.routing.length
      ? `Tickets are used for: ${c.routing.join(", ")}`
      : "";

    if (c.routing.includes("Report users")) {
      problem_solutions.push({
        problem: "User wants to report someone",
        solution: `Collect: ${c.reportCollect.join(", ")}. ${c.reportConfidential ? "Keep reporter confidential." : ""} Never express judgments about the accused.`,
      });
      instructions_extra.push("Never express judgments about the accused.");
      if (c.reportConfidential) {
        instructions_extra.push("Never reveal who reported.");
      }
    }

    if (c.routing.includes("Request roles")) {
      const reqs = c.requestableRoles
        .filter((r) => r.roleName && r.requirement)
        .map((r) => `@${r.roleName}: ${r.requirement}`)
        .join("; ");
      problem_solutions.push({
        problem: "User requests a role",
        solution: `Verify declared requirements (${reqs || "as configured"}), pass to staff — never assign roles directly.`,
      });
      instructions_extra.push(
        "Verify the declared requirements, pass to staff — never assign roles directly.",
      );
    }

    if (c.routing.includes("Ban/warn appeals")) {
      const who =
        roleNames(c.appealDeciderRoleIds, roleNameById) || "staff";
      problem_solutions.push({
        problem: "User appeals a ban/warn",
        solution: `Collect: ${c.appealInclude.join(", ") || "reason"}. Who decides: ${who}. Stay neutral, never anticipate the outcome.`,
      });
      instructions_extra.push(
        "Stay neutral on appeals, never anticipate the outcome or judge the sanction.",
      );
    }

    if (c.routing.includes("Questions about rules") || c.rulesEnabled) {
      if (c.rulesText) knowledge_sources.push(`Server rules: ${c.rulesText.slice(0, 500)}`);
      if (c.rulesChannelId)
        knowledge_sources.push(`Rules channel: <#${c.rulesChannelId}>`);
      instructions_extra.push(
        "Cite the relevant rule; if the case isn't covered, say so and pass to staff.",
      );
    }

    if (c.disputesMode === "straight_staff") {
      instructions_extra.push(
        "Member disputes: stay neutral, escalate straight to staff. Never take sides.",
      );
    } else {
      instructions_extra.push(
        "Member disputes: calm down, collect both versions, then escalate to staff. Never take sides.",
      );
    }

    const partnerForce = c.routing.includes("Partnership");
    problem_solutions.push(
      ...partnershipProblems(
        partnerForce ? { ...c.partnership, enabled: true } : c.partnership,
        roleNameById,
      ),
    );

    const autonomyLabels: Record<string, string> = {
      rules: "rules",
      role_requirements: "role requirements",
      complete_reports: "complete reports",
      nothing_else: "nothing else",
    };
    const auto = c.autonomy
      .map((a) => autonomyLabels[a] || a)
      .filter((a) => a !== "nothing else");
    instructions_extra.push(
      `You can handle autonomously: ${auto.join(", ") || "none"}. For everything else: collect info and pass to staff.`,
    );
  }

  if (cat === "other") {
    const o = answers.other;
    general_info_extra = o.routing.length
      ? `Users open tickets to: ${o.routing.join(", ")}`
      : "";
    problem_solutions.push(...psRows(o.problems));
    if (o.routing.includes("Purchases/payments")) {
      payment_info = formatPaymentsForCompile(o.payments);
      if (payment_info) {
        instructions_extra.push(
          "State ONLY the configured payment data, exactly as written.",
        );
      }
    }
    problem_solutions.push(
      ...partnershipProblems(o.partnership, roleNameById),
    );
    const autonomyLabels: Record<string, string> = {
      faq: "FAQ",
      collect_info: "collect info before staff",
      nothing_else: "nothing else",
    };
    const auto = o.autonomy
      .map((a) => autonomyLabels[a] || a)
      .filter((a) => a !== "nothing else");
    instructions_extra.push(
      `You can handle autonomously: ${auto.join(", ") || "none"}. For everything else: collect info and pass to staff.`,
    );
  }

  // Step 7 linkable channels
  if (answers.linkableChannels.length) {
    const lines = answers.linkableChannels
      .filter((c) => c.channelId)
      .map((c) => {
        const purpose =
          c.purpose === "Other" ? c.purposeCustom || "Other" : c.purpose;
        return `${purpose} → <#${c.channelId}>`;
      });
    if (lines.length) {
      general_info_extra = [general_info_extra, "Channels:", ...lines]
        .filter(Boolean)
        .join("\n");
      instructions_extra.push(
        `Channels: ${lines.join(". ")}. Link the relevant channel with its mention. NEVER cite channels outside the list or invent channel names.`,
      );
    }
  }

  // Dedup problems by problem text
  const seen = new Set<string>();
  problem_solutions = problem_solutions.filter((p) => {
    const k = p.problem.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return {
    general_info_extra,
    payment_info,
    problem_solutions,
    knowledge_sources,
    instructions_extra,
  };
}

export function seedCategoryFromScan(
  category: WizardCategory,
  scan: AiDiscoveryScanResult | null,
  extracted: { problem: string; solution: string; frequency: number }[],
): Pick<WizardAnswers, "selling" | "saas" | "community" | "other" | "linkableChannels"> {
  const partnerSuggested = !!scan?.partnership_detected;
  const partnership = emptyPartnership(
    partnerSuggested,
    partnerSuggested ? "partnership channel/panel found" : undefined,
  );

  const problemsFromExtract: ProblemSolutionRow[] = extracted
    .slice(0, 5)
    .map((p) => ({
      id: newRuleId(),
      problem: p.problem,
      solution: p.solution,
      suggested: true,
      why: "from transcripts",
      touched: false,
    }));

  const selling = emptySelling(partnership);
  selling.problems = problemsFromExtract;

  const saas = emptySaas(partnership);
  saas.problems = problemsFromExtract;

  const community = emptyCommunity(partnership);
  const rulesCh = scan?.classified_channels?.knowledge?.find((c) =>
    /rules|regole|regolamento/i.test(c.name),
  );
  if (rulesCh) {
    community.rulesEnabled = true;
    community.rulesChannelId = rulesCh.id;
    community.rulesChannelName = rulesCh.name;
  }

  const other = emptyOther(partnership);
  other.problems =
    problemsFromExtract.length >= 2
      ? problemsFromExtract
      : [
          ...problemsFromExtract,
          {
            id: newRuleId(),
            problem: "",
            solution: "",
            suggested: false,
            touched: false,
          },
          {
            id: newRuleId(),
            problem: "",
            solution: "",
            suggested: false,
            touched: false,
          },
        ].slice(0, 2);

  // Prefill linkable channels from scan
  const linkableChannels: LinkableChannel[] = [];
  const classified = scan?.classified_channels;
  if (classified) {
    for (const c of classified.selling.slice(0, 2)) {
      linkableChannels.push({
        id: newRuleId(),
        purpose: "Price list",
        purposeCustom: "",
        channelId: c.id,
        channelName: c.name,
        suggested: true,
        why: c.reason || "selling signal",
      });
    }
    for (const c of classified.announcements.slice(0, 1)) {
      linkableChannels.push({
        id: newRuleId(),
        purpose: "Announcements",
        purposeCustom: "",
        channelId: c.id,
        channelName: c.name,
        suggested: true,
        why: c.reason || "announcements",
      });
    }
    for (const c of classified.knowledge.filter((x) =>
      /rules|regole/i.test(x.name),
    ).slice(0, 1)) {
      linkableChannels.push({
        id: newRuleId(),
        purpose: "Rules",
        purposeCustom: "",
        channelId: c.id,
        channelName: c.name,
        suggested: true,
        why: "rules channel",
      });
    }
  }

  return { selling, saas, community, other, linkableChannels };
}

export function validateCategoryStep(answers: WizardAnswers): string | null {
  const cat = answers.category;
  if (!cat) return "Select a category first.";

  if (cat === "selling") {
    const s = answers.selling;
    if (!s.products.length) return "Select at least one product type.";
    if (!s.delivery) return "Select a delivery method.";
    if (
      (s.delivery === "manual" || s.delivery === "depends") &&
      !s.deliveryMaxTime
    )
      return "Select maximum delivery time.";
    if (!paymentsHasDetails(s.payments))
      return "Add at least one payment method with details.";
    if (
      s.refundPolicy === "case_by_case" &&
      !s.refundCaseExplain.trim()
    )
      return "Explain how case-by-case refund evaluation works.";
    if (s.pricesMode === "link" && !s.pricesChannelId && !s.pricesUrl.trim())
      return "Provide a price list channel or URL.";
  }

  if (cat === "saas") {
    const s = answers.saas;
    if (!s.productType) return "Select a product type.";
    if (!s.pricingModel) return "Select a pricing model.";
  }

  if (cat === "community") {
    if (!answers.community.routing.length)
      return "Select at least one ticket reason.";
  }

  if (cat === "other") {
    const filled = answers.other.problems.filter(
      (p) => p.problem.trim() && p.solution.trim(),
    ).length;
    if (filled < 2)
      return "Add at least 2 problem → solution pairs (required for Other).";
    if (
      answers.other.routing.includes("Purchases/payments") &&
      !paymentsHasDetails(answers.other.payments)
    )
      return "Add payment details for Purchases/payments routing.";
  }

  return null;
}
