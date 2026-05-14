/**
 * API Shield - Secondary defense layer against injection attacks
 * 
 * IMPORTANT: This is NOT the primary defense.
 * PRIMARY defense: Always use parameterized queries (Mongoose handles this automatically)
 * 
 * This middleware adds defense-in-depth by catching obvious attack patterns,
 * but a sophisticated attacker could bypass it. Never rely on this alone.
 * 
 * For production: Use Web Application Firewall (WAF) in addition to this.
 */
export const apiShield = (req, res, next) => {
  try {
    const data = JSON.stringify(req.body).toLowerCase();

    // SQL/NoSQL injection patterns with word boundaries
    const patterns = [
      // XSS
      /<script[^>]*>|<\/script>/,
      /<iframe[^>]*>|<\/iframe>/,
      /on(load|error|click|submit)/,
      
      // SQL/NoSQL injection keywords (with word boundaries to catch variations)
      /\bselect\b(?:\s|;|\(|\/)/,  // select followed by space, semicolon, parenthesis, or comment
      /\bunion\b(?:\s|;|\(|\/)/,   // union-based injection
      /\binsert\b(?:\s|;|\(|\/)/,
      /\bupdate\b(?:\s|;|\(|\/)/,
      /\bdelete\b(?:\s|;|\(|\/)/,
      /\bdrop\b(?:\s|;|\(|\/)/,
      /\bexec\b(?:\s|;|\(|\/)/,
      /\bexecute\b(?:\s|;|\(|\/)/,
      
      // Comment bypass attempts
      /--\s|#\s|\/\*|\*\//,
      
      // Logic manipulation
      /\b(or|and)\b\s*1\s*(=|==)/,  // ' or 1=1
      /'\s*(or|and)\s*'/,            // ' or '
      
      // Encoding attempts
      /%27|%22|%2d%2d|%23/,         // URL encoded quotes and comments
      /\\x[0-9a-f]{2}/,             // Hex encoding
    ];

    const isAttack = patterns.some((p) => {
      return typeof p === 'string' ? data.includes(p) : p.test(data);
    });

    if (isAttack) {
      return res.status(403).json({
        success: false,
        message: "Suspicious request blocked 🚨",
      });
    }

    next();
  } catch (err) {
    // Fail open - don't block legitimate requests if shield errors
    next();
  }
};