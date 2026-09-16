from datetime import datetime, timezone
from typing import Dict, Any, List

class AnomalyDetectionService:
    @staticmethod
    def assess_risk(
        denial_reason: str,
        attempt_count_last_5min: int = 1,
        is_unknown_device: bool = False,
        is_off_hours: bool = False,
        is_hash_mismatch: bool = False
    ) -> Dict[str, Any]:
        """
        AI-assisted anomaly heuristic risk assessment engine.
        Always categorizes output as 'Risk indication' rather than definitive proof of malicious behavior.
        """
        signals: List[str] = []
        score = 0.1

        if is_hash_mismatch:
            score += 0.8
            signals.append("Document cryptographic SHA-256 mismatch detected against anchored ledger")

        if denial_reason == "RELEASE_WINDOW_NOT_STARTED":
            score += 0.45
            signals.append("Premature examination paper access attempted ahead of time-lock release")

        if is_unknown_device:
            score += 0.4
            signals.append("Hardware fingerprint mismatch: device not authorized for this examination centre")

        if attempt_count_last_5min > 3:
            score += 0.35
            signals.append(f"High access frequency detected: {attempt_count_last_5min} requests within short window")

        if is_off_hours:
            score += 0.2
            signals.append("Out-of-schedule custody inspection requested outside normal administrative hours")

        # Clamp score
        final_score = min(1.0, max(0.0, score))

        if final_score >= 0.8:
            risk_level = "CRITICAL"
        elif final_score >= 0.55:
            risk_level = "HIGH"
        elif final_score >= 0.3:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return {
            "risk_level": risk_level,
            "risk_score": round(final_score, 2),
            "signals": signals,
            "classification_notice": "Risk indication calculated from behavioral telemetry, not conclusive proof of malicious intent.",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

anomaly_service = AnomalyDetectionService()
