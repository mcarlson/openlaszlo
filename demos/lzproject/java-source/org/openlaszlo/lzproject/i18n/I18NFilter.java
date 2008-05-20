/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.lzproject.i18n;

import java.io.IOException;

import java.util.Enumeration;

import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

/**
 * Servlet filter for localization: iterates through all available locales in
 * the HTTP request and tries to find the best matching one.
 *
 * @web.filter name="I18NFilter" display-name = "Filter loading I18N message
 *             bundle" load-on-startup = "1"
 * @web.filter-mapping url-pattern="/lzproject/rest/*"
 *
 * @author raju
 */
public class I18NFilter implements Filter {

    /** Log4j logger */
    protected Logger log = Logger.getLogger(I18NFilter.class);

    /** The base name for the resource bundle */
    private final static String BASE_NAME = "org.openlaszlo.lzproject.LzTrackMessages";

    /** The resource bundle for testing which resource bundle is available */
    private ResourceBundle bundle = null;

    /** Locale to be stored in the session */
    private Locale locale;

    /** The default locale we are using */
    private Locale defaultLocale = new Locale("en");

    /** The HTTP request, used to retrieve a session */
    private HttpServletRequest httpRequest = null;

    /** The HTTP session. The locale is stored in the session */
    private HttpSession session = null;

    /**
     * Filter all request to one of the web services.
     *
     * <p>
     * The following steps are executed here:
     * <ol>
     *      <li>Set the character encoding for the request to UTF-8</li>
     *      <li>Look for a request parameter <em>language</em> containing
     *          the user seleced locale to be used.</li>
     *      <li>Look for a locale in the session.</li>
     *      <li>Try to find the best matching locale by matching them to
     *          available resource bundles, if we don't have a locale in
     *          the session.</li>
     *      <li>If there was a locale parameter, try to load that
     *          resource bundle.</li>
     * </ol>
     *
     * @param request
     *            ServletRequest object
     * @param response
     *            ServletResponse object
     *
     */
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain filterChain) throws IOException, ServletException {
        // All data coming from the app is UTF-8
        request.setCharacterEncoding("UTF-8");

        // Retrieve the HTTP session
        httpRequest = (HttpServletRequest) request;
        session = httpRequest.getSession();

        // A locale can be manually selected by passing a request paramater
        // with the variable name language to the filter containing a
        // ISO-639 two letter country code
        String languageCode = httpRequest.getParameter("language");

        // Check if we have a locale in the session
        this.locale = (Locale) session.getAttribute("myLocale");

        // If no locale is defined in the session, automatically find the best
        // match
        if (this.locale == null) {
            this.findBundle();
        }

        // Check if user manually selected a new language for the app
        if (languageCode != null && languageCode.length() == 2
                && languageCode != this.locale.getLanguage()) {
            this.setNewLocale(languageCode);
        }
        filterChain.doFilter(request, response);
    }

    public void init(FilterConfig arg0) throws ServletException {
        // TODO Auto-generated method stub

    }

    /**
     * Destroy servlet filter.
     */
    public void destroy() {
        log.debug("I18N filter destroyed");
    }

    /**
     * Set a new locale based on a String containing the language code for the
     * new locale.
     *
     * @param languageCode
     *            The ISO-639 language code for the new locale Creates a new
     *            locale based on the language code send to the filter. Then
     *            tries to load the ResourceBundle for that language. If the
     *            ResourceBundle can be loaded the Locale in the session is
     *            updated to the new one.
     *
     */
    private void setNewLocale(String languageCode) {
        languageCode = languageCode.toLowerCase();
        // get a bundle and see whether it has a good locale
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        Locale newLocale = new Locale(languageCode);
        bundle = ResourceBundle.getBundle(I18NFilter.BASE_NAME, newLocale, cl);
        String testedLang = bundle.getLocale().getLanguage();
        if (testedLang.equals(languageCode)) {
            // This is the locale we have been looking for
            session.setAttribute("myLocale", bundle.getLocale());
            log.debug("Switching to language " + bundle.getLocale() + " / "
                    + bundle.getLocale().getDisplayLanguage());
        } else if (languageCode.equals(defaultLocale.getLanguage())) {
            // This is the default locale right now
            session.setAttribute("myLocale", bundle.getLocale());
            log.debug("Using default locale " + defaultLocale);
        } else {
            // Requested locale not found, change nothing
            log.warn("Invalid locale or missing resource bundle for manually selected locale "
                            + languageCode);
        }
    }

    /**
     * Locates and prepares a ResourceBundle for use within LZProject. The
     * first preferred locale available that matches at least on basis of
     * language is used.
     *
     * Once a preferred locale has been determined for the given bundle name,
     * the locale is cached in the user's session, so that the above computation
     * can be avoided the next time the user requests a page with this bundle.
     */
    private void findBundle() {
        // if we now have a locale, grab the resource bundle
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        if (locale != null) {
            bundle = ResourceBundle.getBundle(I18NFilter.BASE_NAME, locale, cl);
            log.debug("Default locale with base " + I18NFilter.BASE_NAME
                    + " found: " + locale);
        }

        // attempt to load the bundle and compute the locale by looping through
        // the browser's preferred locales; cache the final locale for future
        // use
        else {
            Enumeration localeEnumerator = httpRequest.getLocales();
            while (localeEnumerator.hasMoreElements()) {
                locale = (Locale) localeEnumerator.nextElement();
                log.debug("Checking for locale " + locale);

                // get a bundle and see whether it has a good locale
                ResourceBundle testBundle = ResourceBundle.getBundle(
                        I18NFilter.BASE_NAME, locale, cl);
                String language = testBundle.getLocale().getLanguage();
                String country = testBundle.getLocale().getCountry();

                // if the requested locale isn't available, the above call will
                // return a bundle with a locale for the same language, or will
                // return the default locale, so we need to compare the locale
                // of the bundle we got back with the one we asked for
                if (testBundle.getLocale().equals(locale)) {
                    // exactly what we were looking for - stop here and use this
                    bundle = testBundle;
                    break;
                } else if (locale.getLanguage().equals(language)) {
                    // the language matches; see if the country matches as well
                    if (locale.getCountry().equals(country)) {
                        // keep looking but this is a good option. it only gets
                        // better if the variant matches too! (note: we will
                        // only
                        // get to this statement if a variant has been provided)
                        bundle = testBundle;
                        continue;
                    } else {
                        // if we don't already have a candidate, this is a good
                        // one otherwise, don't change it because the current
                        // candidate might match the country but not the variant
                        if (bundle == null) {
                            bundle = testBundle;
                        }
                        continue;
                    }
                } else {
                    log.debug("Locale " + locale + " not available");
                }
            } // end while loop / stepping through localeEnumerator

            // Bundle should not be null here, but just to make sure we have one,
            // select the default one.
            if (bundle == null) {
                bundle = ResourceBundle.getBundle(I18NFilter.BASE_NAME);
            }

            log.debug("Using locale " + locale);

            // If we don't have a locale in the session, store it now
            if (session.getAttribute("myLocale") == null) {
                session.setAttribute("myLocale", bundle.getLocale());
            }
        }

    }

}
