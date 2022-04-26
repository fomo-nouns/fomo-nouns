import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mobileapp/screens/play/widgets/in_dev.dart';
import 'package:mobileapp/screens/play/widgets/noun.dart';
import 'package:mobileapp/screens/play/widgets/vote_bar.dart';
import 'package:mobileapp/screens/play/web_view_play/web_view_play.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

class PlayScreen extends StatelessWidget {
  const PlayScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialWidget(
      child: WebViewPlay(),
      // Column(
      //   mainAxisAlignment: MainAxisAlignment.center,
      //   children: const [
      //     // Noun(),
      //     // VoteBar(),
      //     // InDev(),
      //   ],
      // ),
    );
  }
}
