import { Request, Response, NextFunction } from "express";

export interface ContextAttributes {
  userOrganizationStatus: string;
  requestIpAddress: string;
  deviceSecurityAttestation: boolean;
}

/**
 * ABAC Validation Policy Engine Evaluation Middleware
 */
export function abacAttributeValidator(policyConstraint: (attr: ContextAttributes) => boolean) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Collect runtime metadata contexts from dynamic ingress layers
    const attributes: ContextAttributes = {
      userOrganizationStatus: req.headers["x-org-status"] as string || "unverified",
      requestIpAddress: req.ip || "unknown",
      deviceSecurityAttestation: req.headers["x-hardware-enclave"] === "true"
    };

    const evaluationPassed = policyConstraint(attributes);

    if (!evaluationPassed) {
      res.status(403).json({
        success: false,
        error: "ABAC Security Interceptor: Request aborted due to situational context property failures."
      });
      return;
    }

    next();
  };
}