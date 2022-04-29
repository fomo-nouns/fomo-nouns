import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_platform_widgets/flutter_platform_widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/screens/play/web_view_play/models/web_data.dart';
import 'package:mobileapp/screens/settings/vibration/cubit/vibration_cubit.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:mobileapp/theme/cubit/theme_cubit.dart';
import 'package:provider/src/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class WebViewPlay extends StatefulWidget {
  const WebViewPlay({Key? key}) : super(key: key);

  @override
  _WebViewPlayState createState() => _WebViewPlayState();
}

class _WebViewPlayState extends State<WebViewPlay> {
  final GlobalKey webViewKey = GlobalKey();

  InAppWebViewController? webViewController;
  InAppWebViewGroupOptions options = InAppWebViewGroupOptions(
      crossPlatform: InAppWebViewOptions(
        useShouldOverrideUrlLoading: true,
        mediaPlaybackRequiresUserGesture: false,
        disableVerticalScroll: true,
        supportZoom: false,
      ),
      android: AndroidInAppWebViewOptions(
        useHybridComposition: true,
      ),
      ios: IOSInAppWebViewOptions(
        allowsInlineMediaPlayback: true,
      ));

  late PullToRefreshController pullToRefreshController;
  String url = "";
  double progress = 0;
  final urlController = TextEditingController();
  bool isLoading = true;

  @override
  void initState() {
    super.initState();

    pullToRefreshController = PullToRefreshController(
      options: PullToRefreshOptions(
        color: AppColors.textColor,
      ),
      onRefresh: () async {
        if (Platform.isAndroid) {
          webViewController?.reload();
        } else if (Platform.isIOS) {
          webViewController?.loadUrl(
            urlRequest: URLRequest(
              url: await webViewController?.getUrl(),
            ),
          );
        }
      },
    );
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: LayoutBuilder(
        builder: (context, constraints) {
          int height = constraints.maxHeight.round();
          String background = context.read<ThemeCubit>().state.isCoolBackground
              ? 'cool'
              : 'warm';

          // "https://fomonouns.wtf/"
          String url =
              "http://localhost:3000/mobile-play/?height=$height&background=$background";
          return Stack(
            children: [
              InAppWebView(
                key: webViewKey,
                initialUrlRequest: URLRequest(url: Uri.parse(url)),
                initialOptions: options,
                pullToRefreshController: pullToRefreshController,
                onWebViewCreated: (controller) {
                  webViewController = controller;
                },
                onLoadStart: (controller, url) {
                  setState(() {
                    this.url = url.toString();
                    urlController.text = this.url;
                  });
                },
                androidOnPermissionRequest:
                    (controller, origin, resources) async {
                  return PermissionRequestResponse(
                    resources: resources,
                    action: PermissionRequestResponseAction.GRANT,
                  );
                },
                shouldOverrideUrlLoading: (controller, navigationAction) async {
                  var uri = navigationAction.request.url!;

                  if (![
                    "http",
                    "https",
                    "file",
                    "chrome",
                    "data",
                    "javascript",
                    "about"
                  ].contains(uri.scheme)) {
                    if (await canLaunch(url)) {
                      // Launch the App
                      await launch(
                        url,
                      );
                      // and cancel the request
                      return NavigationActionPolicy.CANCEL;
                    }
                  }

                  return NavigationActionPolicy.ALLOW;
                },
                onLoadStop: (controller, url) async {
                  pullToRefreshController.endRefreshing();
                  setState(() {
                    this.url = url.toString();
                    urlController.text = this.url;
                    isLoading = false;
                  });
                },
                onLoadError: (controller, url, code, message) {
                  pullToRefreshController.endRefreshing();
                },
                onProgressChanged: (controller, progress) {
                  if (progress == 100) {
                    pullToRefreshController.endRefreshing();
                  }
                  setState(() {
                    this.progress = progress / 100;
                    urlController.text = this.url;
                  });
                },
                onUpdateVisitedHistory: (controller, url, androidIsReload) {
                  setState(() {
                    this.url = url.toString();
                    urlController.text = this.url;
                  });
                },
                onConsoleMessage: (controller, consoleMessage) {
                  try {
                    var decodedJSON = jsonDecode(consoleMessage.message);
                    var webData = FomoNounsWebData.fromJson(decodedJSON);

                    if (webData.type.isNewNoun) {
                      context.read<ThemeCubit>().updateTheme(webData);
                      context.read<VibrationCubit>().newNoun();
                    } else if (webData.type.isVoteSent) {
                      context.read<VibrationCubit>().voteButtonClick();
                    }
                  } on FormatException catch (_) {
                    print(consoleMessage);
                  }
                },
              ),
              isLoading
                  ? Container(
                      color: Theme.of(context).backgroundColor,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(height: 80.w),
                          SizedBox(
                            width: 320.w,
                            child: Image.asset(
                                'assets/img/loading-skull-noun.gif'),
                          ),
                          SidePadding(
                            child: Container(
                              height: 100.w,
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFFFFF).withOpacity(0.5),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(20.w)),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.black.withOpacity(0.1),
                                    offset: Offset(0.0, 4.h),
                                    blurRadius: 10.w,
                                  )
                                ],
                              ),
                              child: Center(
                                child: PlatformCircularProgressIndicator(),
                              ),
                            ),
                          )
                        ],
                      ),
                    )
                  : Container(),
            ],
          );
        },
      ),
    );
  }
}
