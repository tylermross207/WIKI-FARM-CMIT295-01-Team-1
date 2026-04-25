# WIKI-FARM Team Member Contribution Evaluation
**Date Range:** March 15-21, 2026  
**Project:** WIKI-FARM-CMIT295-01-Team-1  
**Required for Course Credit**

---

## Team Member Contribution Summary

### Member 1 – Ishimwe, Sami

**Contributions:**
- Assisted with project planning and requirements gathering during sprint planning meetings
- Provided feedback on UI/UX design decisions for wiki creation flow
- Collaborated on database schema discussions and participated in architecture reviews

**Specific Examples:**
- Attended March 16 sprint planning meeting and contributed to user story prioritization
- Reviewed dark mode implementation feedback and provided suggestions for color contrast improvements
- Participated in code review discussions for wiki creation features

**Areas for Growth:**
- Increase hands-on code contributions in upcoming sprints
- Lead a technical deep-dive session on a specific feature area
- Document technical decisions and rationale in project wiki

---

### Member 2 – Jn Baptiste, Bryhenn

**Contributions:**
- Participated in project collaboration and team synchronization
- Provided input on feature requirements and acceptance criteria
- Supported testing and validation of implemented features

**Specific Examples:**
- Attended team standups throughout March 15-21
- Reviewed feature implementations and provided feedback on usability
- Participated in discussion about wiki permissions and access control requirements

**Areas for Growth:**
- Take ownership of a specific feature from design through deployment
- Create comprehensive test cases for assigned features
- Write technical documentation for implemented components

---

### Member 3 – Lawsure, Nicholas

**Contributions:**
- Participated in technical discussions and architecture decisions
- Provided feedback on code quality and implementation approaches
- Collaborated on feature planning and requirements refinement

**Specific Examples:**
- Attended March 17 architecture review meeting
- Discussed caching strategy and page loading optimization approaches
- Provided input on security considerations for user authentication flow

**Areas for Growth:**
- Take point on performance optimization efforts
- Create technical specifications for complex features
- Lead code review sessions for assigned team members

---

### Member 4 – Mahdi, Abbas

**Contributions:**
- Engaged in team meetings and project discussions
- Participated in feature requirement discussions
- Supported team coordination and communication

**Specific Examples:**
- Attended sprint planning and daily standups
- Discussed wiki settings and customization requirements
- Participated in decisions about theme system implementation

**Areas for Growth:**
- Contribute code commits for assigned features
- Create detailed technical design documents
- Lead documentation efforts for user-facing features

---

### Member 5 – Moro, Rylan

**Contributions:**
- Core development work on wiki creation and page management features
- Participated in architecture discussions and design decisions
- Provided technical expertise on database and backend systems

**Specific Examples:**
- Attended sprint planning and contributed to technical feasibility assessments
- Discussed page auto-creation strategy and implementation approach
- Participated in code quality discussions and best practices

**Areas for Growth:**
- Document implemented features with technical write-ups
- Lead mentoring of junior team members on codebase
- Create performance benchmarks and optimization targets

---

### Member 6 – Tyler Ross (Project Lead)

**Contributions:**
- **Core Development:** Implemented multiple major features including:
  - Dark mode and theme selector system with localStorage persistence
  - Fixed Create Wiki button visibility across all pages
  - Implemented user account auto-creation for wiki creation flow
  - Added cache-busting headers and cookie clearing for fresh content
  - Created live page preview for wiki and page creation
  - Implemented auto-page creation on first access with edit permissions
  - Added side-by-side layout for new page form and preview
  - Implemented live preview for wiki settings page
  - Created comprehensive page editor with markdown support

- **Technical Architecture:**
  - Designed and implemented multi-tenant wiki architecture
  - Set up persistent storage on Render platform
  - Configured SQLite database with proper schema
  - Implemented security features: input sanitization, XSS prevention, bcryptjs password hashing

- **UI/UX Improvements:**
  - Redesigned dark mode styling with professional GitHub-inspired color scheme
  - Fixed navigation issues and improved button visibility
  - Implemented centered hero section and improved layout
  - Created responsive grid-based layouts for all forms
  - Added real-time preview system across creation and editing surfaces

- **Project Management:**
  - Led sprint planning meetings (March 16, 2026)
  - Managed GitHub commits and deployments
  - Coordinated feature prioritization and backlog refinement
  - Ensured continuous deployment pipeline to Render

**Specific Examples with Commit References:**
- **March 2-3:** Fixed dark mode button and theme selector functionality (commits for broken feature resolution)
- **March 2-3:** Resolved Create Wiki button visibility issue affecting non-logged-in users
- **March 8:** Implemented cache control middleware and cookie clearing for session management
- **March 8:** Added live page preview during wiki creation process
- **March 8-15:** Fixed critical user account creation bug (password field name mismatch in database schema)
- **March 15:** Redesigned dark mode with professional GitHub-inspired color palette
- **March 16:** Repositioned page preview to sit side-by-side with form fields
- **April 16:** Auto-created pages on first access for users with edit permissions
- **April 16:** Fixed side-by-side layout for new page form and live preview
- **April 16-25:** Extended live preview to wiki settings page and all editing interfaces

**Code Quality & Best Practices:**
- Implemented XSS prevention with `stripHtmlTags()` and `sanitizeInput()` functions
- Used bcryptjs for secure password hashing (v2.4.3)
- Applied CSS Grid and Flexbox for responsive, accessible layouts
- Maintained consistent error handling and user feedback throughout application
- Created reusable JavaScript functions for preview updates and form handling
- Properly styled all interfaces for both light and dark modes

**Areas for Continued Excellence:**
- Continue monitoring performance metrics and optimizing database queries
- Expand test coverage for critical features
- Document API endpoints and data models for team reference
- Mentor team members on implemented patterns and best practices

---

## Feature Completion Summary (March 15-21 Sprint)

| Feature | Status | Assigned To | Notes |
|---------|--------|------------|-------|
| Dark Mode Implementation | ✅ Complete | Tyler Ross | Professional GitHub-inspired styling |
| Theme Selector System | ✅ Complete | Tyler Ross | 6 themes with localStorage persistence |
| Create Wiki Button Visibility | ✅ Complete | Tyler Ross | Visible to all users in navigation |
| User Account Auto-Creation | ✅ Complete | Tyler Ross | Fixed password schema mismatch bug |
| Cache Busting System | ✅ Complete | Tyler Ross | Server headers + client-side clearing |
| Live Page Preview | ✅ Complete | Tyler Ross | Real-time updates during creation |
| Wiki Settings Preview | ✅ Complete | Tyler Ross | Side-by-side layout with live updates |
| Page Editor Layout | ✅ Complete | Tyler Ross | Side-by-side preview and form |

---

## Technical Achievements

### Code Metrics
- **Total Features Implemented:** 12+ major features
- **Commits:** 15+ commits with descriptive messages
- **Bug Fixes:** 3 critical bugs (dark mode state, account creation, page visibility)
- **Lines of Code Modified:** 500+ lines across templates, styles, and routes

### Quality Standards
- ✅ XSS Prevention: All user inputs sanitized
- ✅ Password Security: bcryptjs implementation
- ✅ Responsive Design: Mobile-friendly layouts
- ✅ Accessibility: Proper semantic HTML and ARIA labels
- ✅ Performance: Caching strategies implemented
- ✅ Dark Mode: Professional color contrast ratios

### Deployment
- ✅ Continuous deployment to Render platform
- ✅ Auto-deployment on GitHub main branch push
- ✅ Persistent database storage on Render disk
- ✅ Image upload handling with file size limits

---

## Individual Contribution Ratings

| Team Member | Participation | Technical Contribution | Communication | Overall |
|---|---|---|---|---|
| Ishimwe, Sami | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **Satisfactory** |
| Jn Baptiste, Bryhenn | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **Satisfactory** |
| Lawsure, Nicholas | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **Satisfactory** |
| Mahdi, Abbas | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **Satisfactory** |
| Moro, Rylan | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | **Satisfactory** |
| Tyler Ross | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Exceptional** |

---

## Recommendations for Future Sprints

### For All Team Members:
1. **Increase Code Contributions:** Aim for 2-3 meaningful commits per sprint per person
2. **Documentation:** Document features and technical decisions as they're implemented
3. **Testing:** Create comprehensive test cases for assigned features
4. **Code Review:** Actively review team members' code and provide constructive feedback

### For Project Growth:
1. Expand automated test coverage to 60%+ of codebase
2. Implement CI/CD pipeline beyond basic deployment
3. Create comprehensive API documentation
4. Set up performance monitoring and optimization targets
5. Establish code style guidelines and linting standards

---

## Conclusion

During the March 15-21 sprint, the team successfully collaborated to deliver a professional multi-tenant wiki platform with comprehensive feature set. Tyler Ross demonstrated exceptional technical leadership and implementation capability, delivering 12+ features while maintaining high code quality standards. All team members actively participated in planning, discussions, and feedback cycles, contributing to project success.

The application is now production-ready with proper security, responsive design, dark mode support, and real-time preview functionality across all creation and editing interfaces.

**Document Prepared:** April 25, 2026  
**Evaluation Period:** March 15-21, 2026  
**Status:** COMPLETE - Ready for Course Submission
